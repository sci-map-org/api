import { LearningMaterial } from '../entities/LearningMaterial';
import { LearningPathLabel } from '../entities/LearningPath';
import { Topic } from '../entities/Topic';
import { env } from '../env';
import { neo4jDriver } from '../infra/neo4j';
import { PaginationOptions } from '../repositories/util/pagination';

function escapeSpecialCaseChar(text: string) {
  // Needs to escape some characters, other Lucene fails to parse
  // https://lucene.apache.org/core/2_9_4/queryparsersyntax.html
  return text.replace(/[-[\]:{}()*+?."\/,\\^$|#\s]/g, '\\$&');
}

export const searchEntities = async (
  queryString: string,
  paginationOptions?: PaginationOptions
): Promise<{ entity: Topic | LearningMaterial; score: number }[]> => {
  const { offset, limit } = { offset: 0, limit: 20, ...paginationOptions };
  const session = neo4jDriver.session();
  const hasTrailingSpace = queryString[queryString.length - 1] === ' ';
  const queryWords = queryString.trim().split(' ').map(escapeSpecialCaseChar);

  const query = queryWords.reduce((query, word, idx) => {
    return (
      query +
      (idx === queryWords.length - 1 && !hasTrailingSpace
        ? `name:${word}* key:${word}* description:${word}* `
        : `name:${word}~ key:${word}~ description:${word}~ `)
    );
  }, `"${escapeSpecialCaseChar(queryString)}"^2`);

  const { records } = await session.run(
    `CALL db.index.fulltext.queryNodes("${env.NEO4J.FULL_TEXT_SEARCH_INDEX_NAME}", $query) YIELD node, score
    WHERE (NOT node:${LearningPathLabel} OR node.public = true)
    RETURN properties(node) as node, score SKIP ${offset} LIMIT ${limit}`,
    {
      query,
    }
  );
  // AND (NOT node:${LearningGoalLabel} OR (node.publishedAt IS NOT NULL AND node.hidden = false))
  session.close();
  return records.map((r) => ({ entity: r.get('node'), score: r.get('score') }));
};
