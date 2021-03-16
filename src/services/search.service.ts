import { LearningMaterial } from '../entities/LearningMaterial';
import { Topic } from '../entities/Topic';
import { env } from '../env';
import { neo4jDriver } from '../infra/neo4j';
import { PaginationOptions } from '../repositories/util/pagination';

export const searchEntities = async (
  queryString: string,
  paginationOptions?: PaginationOptions
): Promise<{ entity: Topic | LearningMaterial; score: number }[]> => {
  const { offset, limit } = { offset: 0, limit: 20, ...paginationOptions };
  const session = neo4jDriver.session();
  // name:${queryString}~0.7^3
  const query = `name:"${queryString}"*^3 name:"${queryString}"~0.8^3 topicType:Domain^3 topicType:LearningGoal^2  key:"${queryString}"~0.8^2 description:"${queryString}"~0.8`;

  const { records } = await session.run(
    `CALL db.index.fulltext.queryNodes("${env.NEO4J.FULL_TEXT_SEARCH_INDEX_NAME}", $query) YIELD node, score
    RETURN properties(node) as node, score SKIP ${offset} LIMIT ${limit}`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => ({ entity: r.get('node'), score: r.get('score') }));
};
