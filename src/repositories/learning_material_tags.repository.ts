import { map, prop } from 'ramda';

import {
  LearningMaterialTagBelongsToLearningMaterial,
  LearningMaterialTagBelongsToLearningMaterialLabel,
} from '../entities/relationships/LearningMaterialTagBelongsToLearningMaterial';
import { LearningMaterialTag, LearningMaterialTagLabel } from '../entities/LearningMaterialTag';
import { neo4jDriver } from '../infra/neo4j';
import { attachNodes, createNode, detachNodes, findOne, getRelatedNodes } from './util/abstract_graph_repo';
import { LearningMaterial, LearningMaterialLabel } from '../entities/LearningMaterial';

export const getLearningMaterialTags = (learningMaterialId: string): Promise<LearningMaterialTag[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialTagBelongsToLearningMaterial, LearningMaterialTag>({
    originNode: {
      label: LearningMaterialLabel,
      filter: {
        _id: learningMaterialId,
      },
    },
    relationship: {
      label: LearningMaterialTagBelongsToLearningMaterialLabel,
    },
    destinationNode: {
      label: LearningMaterialTagLabel,
    },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const findOrCreateLearningMaterialTag = async (name: string): Promise<LearningMaterialTag> => {
  const existingLearningMaterialTag = await findOne<LearningMaterialTag, { name: string }>({ label: LearningMaterialTagLabel })({
    name: name.toLowerCase(),
  });
  if (existingLearningMaterialTag) {
    return existingLearningMaterialTag;
  }
  return createNode<LearningMaterialTag>({ label: LearningMaterialTagLabel })({ name: name.toLowerCase() });
};

export const attachTagsToLearningMaterial = (learningMaterialId: string, tags: string[]) =>
  Promise.all(
    tags.map(tag =>
      attachNodes<LearningMaterial, LearningMaterialTagBelongsToLearningMaterial, LearningMaterialTag>({
        originNode: {
          label: LearningMaterialLabel,
          filter: { _id: learningMaterialId },
        },
        relationship: {
          label: LearningMaterialTagBelongsToLearningMaterialLabel,
        },
        destinationNode: {
          label: LearningMaterialTagLabel,
          filter: { name: tag.toLowerCase() },
        },
      })
    )
  );

export const detachTagsFromLearningMaterial = (learningMaterialId: string, tags: string[]): Promise<LearningMaterial> =>
  detachNodes<LearningMaterial, LearningMaterialTagBelongsToLearningMaterial, LearningMaterialTag>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialTagBelongsToLearningMaterialLabel,
      filter: {},
    },
    destinationNode: {
      label: LearningMaterialTagLabel,
      filter: { name: { $in: tags.map(tag => tag.toLowerCase()) } },
    },
  }).then(([{ originNode }]) => originNode);

export const findLearningMaterialTags = async (query: string, pagination: { offset?: number; limit?: number }) => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${LearningMaterialTagLabel})<-[relation:${LearningMaterialTagBelongsToLearningMaterialLabel}]-(learningMaterial:${LearningMaterialLabel}) ${query ? 'WHERE toLower(node.name) CONTAINS toLower($query) ' : ''
    }RETURN properties(node) AS node, COUNT(relation) as usageCount ORDER BY COUNT(relation) DESC${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''
    }${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => ({ name: r.get('node').name, usageCount: r.get('usageCount').toNumber() }));
};
