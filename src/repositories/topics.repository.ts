import { DomainLabel } from '../entities/Domain';
import { TopicBelongsToDomainLabel } from '../entities/relationships/TopicBelongsToDomain';
import { Topic, TopicLabel, TopicType } from '../entities/Topic';
import { neo4jDriver } from '../infra/neo4j';

export const searchTopics = async (
  query: string,
  pagination: { offset?: number; limit?: number }
): Promise<Topic[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${TopicLabel}) ${
      query
        ? 'WHERE toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query)'
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
    MATCH (d)<-[:${TopicBelongsToDomainLabel}*1..20]-(node:${TopicLabel}) WHERE 
    (toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query)) ${
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
