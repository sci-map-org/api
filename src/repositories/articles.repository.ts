import { generate } from 'shortid';
import * as shortid from 'shortid';

import { ArticleNotFoundError } from '../errors/NotFoundError';
import { neo4jDriver } from '../infra/neo4j';
import { createNode, findOne, getFilterString, createRelatedNode, updateRelatedNode } from './util/abstract_graph_repo';

export enum ArticleContentType {
  Markdown = 'markdown',
}

export interface Article {
  _id: string;
  key: string;
  contentType: ArticleContentType;
  title: string;
  content: string;
}

export interface CreateArticleData {
  contentType: ArticleContentType;
  title: string;
  content: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
}

const generateKey = generate;

export const createArticle = (data: CreateArticleData): Promise<Article> =>
  createNode<CreateArticleData & { key: string; _id: string }, Article>({ label: 'Article' })({
    ...data,
    _id: shortid.generate(),
    key: generateKey(),
  });

// export const writeArticle = async (
//   author: { _id: string },
//   data: {
//     contentType: ArticleContentType;
//     title: string;
//     content: string;
//   }
// ): Promise<Article> => {
//   const session = neo4jDriver.session();

//   const { records } = await session.run(
//     `MATCH (node:User ${getFilterString(
//       author
//     )}) CREATE (article:Article $props) CREATE (node)-[r:WROTE]->(article) RETURN properties(article) as node`,
//     {
//       filter: author,
//       props: { ...data, _id: shortid.generate(), key: generateKey() },
//     }
//   );
//   console.log(records);
//   session.close();

//   const record = records.pop();

//   if (!record) throw new Error();

//   return { ...record.get('node'), authorId: author._id };
// };

export const writeArticle = (
  author: { _id: string } | { key: string },
  data: {
    contentType: ArticleContentType;
    title: string;
    content: string;
  }
): Promise<Article> =>
  createRelatedNode({
    originNode: {
      label: 'User',
      filter: author,
    },
    relationship: {
      label: 'WROTE',
      props: {
        createdAt: Date.now(),
      },
    },
    newNode: {
      label: 'Article',
      props: { ...data, _id: shortid.generate(), key: generateKey() },
    },
  });

// createNode<CreateArticleData & { key: string; _id: string }, Article>({ label: 'Article' })({
//   ...data,
//   _id: shortid.generate(),
//   key: generateKey(),
// });

export const findArticles = async (
  filter: {},
  pagination?: { offset?: number; limit?: number }
): Promise<Article[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:Article ${getFilterString(filter)}) RETURN properties(node) AS node${
      pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''
    }${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`,
    {
      filter,
    }
  );
  session.close();

  return records.map(r => r.get('node'));
};

export const findArticleById = (id: string): Promise<Article | null> =>
  findOne<Article>({ label: 'Article' })({ _id: id });

export const findArticleByKey = async (key: string): Promise<Article | null> =>
  findOne<Article>({ label: 'Article' })({ key });

export const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
  const session = neo4jDriver.session();
  const filter = { _id: id };
  const { records } = await session.run(
    `MATCH (node:Article ${getFilterString(filter)}) SET node += $updatedProperties RETURN properties(node) AS node`,
    {
      filter,
      updatedProperties: data,
    }
  );
  session.close();
  const record = records.pop();

  if (!record) throw new ArticleNotFoundError(id, 'id');

  return record.get('node');
};

export const updateArticleWrittenBy = async (
  authorFilter: { _id: string } | { key: string },
  articleFilter: { key: string } | { _id: string },
  data: UpdateArticleData
): Promise<Article> =>
  updateRelatedNode({
    originNode: {
      label: 'User',
      filter: authorFilter,
    },
    relationship: {
      label: 'WROTE',
      filter: {},
    },
    destinationNode: {
      label: 'Article',
      filter: articleFilter,
      props: data,
    },
  });
