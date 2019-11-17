import { generate } from 'shortid';
import * as shortid from 'shortid';

import { ArticleNotFoundError } from '../errors/NotFoundError';
import { neo4jDriver } from '../infra/neo4j';
import {
  createNode,
  findOne,
  getFilterString,
  createRelatedNode,
  updateRelatedNode,
  getRelatedNode,
  getRelatedNodes,
} from './util/abstract_graph_repo';
import { User } from './users.repository';

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

// export const createArticle = (data: CreateArticleData): Promise<Article> =>
//   createNode<CreateArticleData & { key: string; _id: string }, Article>({ label: 'Article' })({
//     ...data,
//     _id: shortid.generate(),
//     key: generateKey(),
//   });

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

export const findArticlesWrittenBy = (
  authorFilter: { _id: string } | { key: string },
  pagination?: { offset?: number; limit?: number }
) =>
  getRelatedNodes({
    originNode: { label: 'User', filter: authorFilter },
    relationship: { label: 'WROTE', filter: {} },
    destinationNode: { label: 'Article', filter: {} },
    pagination,
  });

export const findArticleById = (id: string): Promise<Article | null> =>
  findOne<Article>({ label: 'Article' })({ _id: id });

export const findArticleByKey = async (key: string): Promise<Article | null> =>
  findOne<Article>({ label: 'Article' })({ key });

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

export const getArticleAuthor = (articleFilter: { key: string } | { _id: string }) =>
  getRelatedNode<User>({
    originNode: {
      label: 'Article',
      filter: articleFilter,
    },
    relationship: {
      label: 'WROTE',
      filter: {},
    },
    destinationNode: {
      label: 'User',
      filter: {},
    },
  });
