import { node, Query, relation } from 'cypher-query-builder';
import { User, UserLabel } from '../../entities/User';
import { neo4jQb } from '../../infra/neo4j';
import { attachUniqueNodes } from './abstract_graph_repo';

// TODO: fix TS
export const generateRateEntityMethod = <E extends { _id: string }, R extends { value: number }>(
  ratedEntityLabel: string,
  ratingRelationshipLabel: string
) => async (userId: string, ratedEntityId: string, value: number): Promise<E> =>
  attachUniqueNodes<User, R, E>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: ratingRelationshipLabel,
      // @ts-ignore
      onCreateProps: {
        value,
      },
      // @ts-ignore
      onMergeProps: {
        value,
      },
    },
    destinationNode: {
      label: ratedEntityLabel,
      // @ts-ignore
      filter: {
        _id: ratedEntityId,
      },
    },
  }).then(({ destinationNode }) => {
    return destinationNode;
  });

export const generateGetRatingMethod = (ratedEntityLabel: string, ratingRelationshipLabel: string) => async (
  _id: string
): Promise<number | null> => {
  const q = new Query(neo4jQb);
  q.match([node('lm', ratedEntityLabel), relation('in', 'rel', ratingRelationshipLabel), node(undefined, UserLabel)]);
  q.where({ lm: { _id } });
  q.with(['avg(rel.value) AS rating']);
  q.return('rating');
  const results = await q.run();

  const result = results.pop();
  if (!result) throw new Error('Unable to compute rating');
  return result.rating ? Number(result.rating.toString()) : null;
};
