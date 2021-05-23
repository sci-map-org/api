import { node, Query, relation } from 'cypher-query-builder';
import { DomainLabel } from '../entities/Domain';
import { TopicBelongsToDomainLabel } from '../entities/relationships/TopicBelongsToDomain';
import { TopicIsSubTopicOfTopic, TopicIsSubTopicOfTopicLabel } from '../entities/relationships/TopicIsSubTopicOfTopic';
import { Topic, TopicLabel, TopicType } from '../entities/Topic';
import { neo4jQb, neo4jDriver } from '../infra/neo4j';
import { attachUniqueNodes, detachUniqueNodes, findOne, getRelatedNodes } from './util/abstract_graph_repo';
import { SortingDirection } from './util/sorting';

export const getTopicById = (topicId: string) =>
  findOne<Topic, { _id: string }>({ label: TopicLabel })({ _id: topicId });

export const searchTopics = async (
  query: string,
  pagination: { offset?: number; limit?: number }
): Promise<Topic[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${TopicLabel}) WHERE (NOT node:LearningGoal OR node.hidden = false) ${
      query
        ? 'AND (toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query))'
        : ''
    }RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => r.get('node'));
};

export const searchSubTopics = async (
  domainId: string,
  query: string,
  pagination: { offset?: number; limit?: number },
  topicTypeIn?: TopicType[]
): Promise<Topic[]> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (d:${DomainLabel}) WHERE d._id = $domainId
    MATCH (d)<-[:${TopicBelongsToDomainLabel}*1..20]-(node:${TopicLabel}) WHERE (NOT (node:LearningGoal) OR node.hidden = false)
    AND (toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query)) ${
      topicTypeIn ? ' AND (node.topicType IN $topicTypeIn)' : ''
    }
     RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
      domainId,
      topicTypeIn,
    }
  );
  session.close();

  return records.map(r => r.get('node'));
};

export const getTopicSize = async (_id: string): Promise<number> => {
  // Sub Domains and concepts only for now, wether topic is concept or domain
  // => add the REQUIRE relationship later (for now it's wrong order)
  const q = new Query(neo4jQb);
  q.raw(
    `match (n:${TopicLabel} {_id: $topicId})<-[:${TopicIsSubTopicOfTopicLabel}*0..5]-(c:${TopicLabel})  return count(DISTINCT c) as size`,
    {
      topicId: _id,
    }
  );
  const r = await q.run();
  const [size] = r.map(i => i.size);
  return size;
};

export const getTopicSubTopics = (
  topicId: string,
  sortingOptions: { type: 'index'; direction: SortingDirection },
  filter?: { topicTypeIn?: TopicType[] }
): Promise<{ parentTopic: Topic; relationship: TopicIsSubTopicOfTopic; subTopic: Topic }[]> =>
  getRelatedNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: TopicLabel,
      ...(!!filter &&
        filter.topicTypeIn && {
          filter: { topicType: { $in: filter.topicTypeIn } },
        }),
      // filter: { hidden: false }, TODO
    },
    sorting: {
      entity: 'relationship',
      field: sortingOptions.type,
      direction: sortingOptions.direction,
    },
  }).then(items =>
    items.map(({ relationship, destinationNode, originNode }) => ({
      parentTopic: originNode,
      relationship,
      subTopic: destinationNode,
    }))
  );

export const getTopicParentTopics = (
  topicId: string,
  sortingOptions: { type: 'index'; direction: SortingDirection },
  filter?: { topicTypeIn?: TopicType[] }
): Promise<{ parentTopic: Topic; relationship: TopicIsSubTopicOfTopic; subTopic: Topic }[]> =>
  getRelatedNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel,
      ...(!!filter &&
        filter.topicTypeIn && {
          filter: { topicType: { $in: filter.topicTypeIn } },
        }),
    },
    sorting: {
      entity: 'relationship',
      field: sortingOptions.type,
      direction: sortingOptions.direction,
    },
  }).then(items =>
    items.map(({ relationship, destinationNode, originNode }) => ({
      parentTopic: destinationNode,
      relationship,
      subTopic: originNode,
    }))
  );

export const attachTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string,
  { index, createdByUserId }: { index: number; createdByUserId?: string }
): Promise<{
  parentTopic: Topic;
  relationship: TopicIsSubTopicOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      onCreateProps: { index, createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: parentTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      parentTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const updateTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string,
  { index }: { index?: number }
): Promise<{
  parentTopic: Topic;
  relationship: TopicIsSubTopicOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: { label: TopicIsSubTopicOfTopicLabel, onMergeProps: { ...(!!index && { index }) } },
    destinationNode: { label: TopicLabel, filter: { _id: parentTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      parentTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const detachTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string
): Promise<{ subTopic: Topic; parentTopic: Topic }> =>
  detachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: subTopicId },
    },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: parentTopicId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subTopic: originNode,
      parentTopic: destinationNode,
    };
  });

export const getSubTopicsMaxIndex = async (topicId: string): Promise<number | null> => {
  const q = new Query(neo4jQb);

  q.match([
    node('n', TopicLabel, { _id: topicId }),
    relation('in', 'r', TopicIsSubTopicOfTopicLabel),
    node('s', TopicLabel),
  ]);

  q.return({ 'r.index': 'maxIndex' });
  q.orderBy({ 'r.index': 'DESC' });
  q.limit(1);

  const r = await q.run();
  if (!r.length) return null;
  const [maxIndex] = r.map(i => i.maxIndex);

  return maxIndex;
};
