import { map, prop } from 'ramda';
import { TopicHasTopicType, TopicHasTopicTypeLabel } from '../entities/relationships/TopicHasTopicType';
import { Topic, TopicLabel } from '../entities/Topic';
import { TopicType, TopicTypeLabel } from '../entities/TopicType';
import { neo4jDriver } from '../infra/neo4j';
import {
  attachUniqueNodes,
  countRelatedNodes,
  createNode,
  detachNodes,
  findOne,
  getRelatedNodes,
} from './util/abstract_graph_repo';

export const getTopicTopicTypes = (topicId: string): Promise<TopicType[]> =>
  getRelatedNodes<Topic, TopicHasTopicType, TopicType>({
    originNode: {
      label: TopicLabel,
      filter: {
        _id: topicId,
      },
    },
    relationship: {
      label: TopicHasTopicTypeLabel,
    },
    destinationNode: {
      label: TopicTypeLabel,
    },
  }).then(map(prop('destinationNode')));

export const findOrCreateTopicType = async (name: string): Promise<TopicType> => {
  const existingTopicType = await findOne<TopicType, { name: string }>({ label: TopicTypeLabel })({
    name: name.toLowerCase(),
  });
  if (existingTopicType) {
    return existingTopicType;
  }
  return createNode<TopicType>({ label: TopicTypeLabel })({ name: name.toLowerCase() });
};

export const attachTopicTypeToTopic = (
  topicId: string,
  topicTypeName: string
): Promise<{ topic: Topic; topicType: TopicType }> =>
  attachUniqueNodes<Topic, TopicHasTopicType, TopicType>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicHasTopicTypeLabel,
    },
    destinationNode: {
      label: TopicTypeLabel,
      filter: { name: topicTypeName.toLowerCase() },
    },
  }).then(({ originNode, destinationNode }) => ({
    topic: originNode,
    topicType: destinationNode,
  }));

export const detachTopicTypesFromTopic = (topicId: string, topicTypeNames: string[]): Promise<Topic> =>
  detachNodes<Topic, TopicHasTopicType, TopicType>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicHasTopicTypeLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicTypeLabel,
      filter: { name: { $in: topicTypeNames.map((type) => type.toLowerCase()) } },
    },
  }).then(([{ originNode }]) => originNode);

export const findTopicTypes = async (
  query: string,
  limit: number
): Promise<Array<TopicType & { usageCount: number }>> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${TopicTypeLabel})<-[relation:${TopicHasTopicTypeLabel}]-(topic:${TopicLabel}) ${
      query ? 'WHERE toLower(node.name) CONTAINS toLower($query) ' : ''
    }RETURN properties(node) AS node, COUNT(relation) as usageCount ORDER BY COUNT(relation) DESC LIMIT ${limit}`,
    {
      query,
    }
  );
  session.close();
  return records.map((r) => ({ ...(r.get('node') as TopicType), usageCount: r.get('usageCount') }));
};

export const getTopicTypeUsageCount = async (topicTypeName: string): Promise<number> =>
  countRelatedNodes<TopicType, TopicHasTopicType, Topic>({
    originNode: {
      label: TopicTypeLabel,
      filter: { name: topicTypeName },
    },
    relationship: {
      label: TopicHasTopicTypeLabel,
    },
    destinationNode: {
      label: TopicLabel,
    },
  });
