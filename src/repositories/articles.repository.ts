import { generate } from 'shortid';
import * as shortid from 'shortid';

import { Article, ArticleContentType } from '../entities/Article';
import { User } from '../entities/User';
import { neo4jDriver } from '../infra/neo4j';
import {
  createRelatedNode,
  deleteRelatedNode,
  findOne,
  getFilterString,
  getRelatedNode,
  getRelatedNodes,
  updateRelatedNode,
} from './util/abstract_graph_repo';

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

export const createArticle = (author: { _id: string } | { key: string }, data: CreateArticleData): Promise<Article> =>
  createRelatedNode({
    originNode: {
      label: 'User',
      filter: author,
    },
    relationship: {
      label: 'CREATED',
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

export const findArticlesCreatedBy = (
  authorFilter: { _id: string } | { key: string },
  pagination?: { offset?: number; limit?: number }
) =>
  getRelatedNodes({
    originNode: { label: 'User', filter: authorFilter },
    relationship: { label: 'CREATED', filter: {} },
    destinationNode: { label: 'Article', filter: {} },
    pagination,
  });

export const findArticle = findOne<Article, { key: string } | { _id: string }>({ label: 'Article' });

export const updateArticleCreatedBy = async (
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
      label: 'CREATED',
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
      label: 'CREATED',
      filter: {},
    },
    destinationNode: {
      label: 'User',
      filter: {},
    },
  });

export const deleteArticleCreatedBy = async (
  authorFilter: { _id: string } | { key: string },
  articleFilter: { key: string } | { _id: string }
): Promise<{ deletedCount: number }> =>
  deleteRelatedNode({
    originNode: {
      label: 'User',
      filter: authorFilter,
    },
    relationship: {
      label: 'CREATED',
      filter: {},
    },
    destinationNode: {
      label: 'Article',
      filter: articleFilter,
    },
  });
