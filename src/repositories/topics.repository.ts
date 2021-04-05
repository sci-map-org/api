import { Query } from 'cypher-query-builder';
import { DomainLabel } from '../entities/Domain';
import { TopicBelongsToDomainLabel } from '../entities/relationships/TopicBelongsToDomain';
import { TopicIsSubTopicOfTopic, TopicIsSubTopicOfTopicLabel } from '../entities/relationships/TopicIsSubTopicOfTopic';
import { Topic, TopicLabel, TopicType } from '../entities/Topic';
import { neo4jQb, neo4jDriver } from '../infra/neo4j';
import { getRelatedNodes } from './util/abstract_graph_repo';

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
  topicId: string
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
      // filter: { hidden: false },
    },
  }).then(items =>
    items.map(({ relationship, destinationNode, originNode }) => ({
      parentTopic: originNode,
      relationship,
      subTopic: destinationNode,
    }))
  );
