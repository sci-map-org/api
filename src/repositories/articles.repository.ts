import { pipe, prop, map } from 'ramda';
import { generate } from 'shortid';
import { Article, ArticleContentType, ArticleLabel } from '../entities/Article';
import { UserCreatedArticle, UserCreatedArticleLabel } from '../entities/relationships/UserCreatedArticle';
import { User, UserLabel } from '../entities/User';
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
  createRelatedNode<User, UserCreatedArticle, Article>({
    originNode: {
      label: UserLabel,
      filter: author,
    },
    relationship: {
      label: UserCreatedArticleLabel,
      props: {
        createdAt: Date.now(),
      },
    },
    newNode: {
      label: ArticleLabel,
      props: { ...data, _id: generate(), key: generateKey() },
    },
  });

export const findArticles = async (
  filter: {},
  pagination?: { offset?: number; limit?: number }
): Promise<Article[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${ArticleLabel} ${getFilterString(filter)}) RETURN properties(node) AS node${
      pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''
    }${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`,
    {
      filter,
    }
  );
  session.close();

  return records.map(r => r.get('node'));
};

export const findArticlesCreatedBy = async (
  authorFilter: { _id: string } | { key: string },
  pagination?: { offset?: number; limit?: number }
): Promise<Article[]> =>
  getRelatedNodes<User, UserCreatedArticle, Article>({
    originNode: { label: UserLabel, filter: authorFilter },
    relationship: { label: UserCreatedArticleLabel, filter: {} },
    destinationNode: { label: ArticleLabel, filter: {} },
    pagination,
  })
    .then(pipe(prop('items')))
    .then(map(prop('destinationNode')));

export const findArticle = findOne<Article, { key: string } | { _id: string }>({ label: 'Article' });

export const updateArticleCreatedBy = async (
  authorFilter: { _id: string } | { key: string },
  articleFilter: { key: string } | { _id: string },
  data: UpdateArticleData
): Promise<Article> =>
  updateRelatedNode({
    originNode: {
      label: UserLabel,
      filter: authorFilter,
    },
    relationship: {
      label: UserCreatedArticleLabel,
      filter: {},
    },
    destinationNode: {
      label: ArticleLabel,
      filter: articleFilter,
      props: data,
    },
  });

export const getArticleAuthor = (articleFilter: { key: string } | { _id: string }) =>
  getRelatedNode<User>({
    originNode: {
      label: ArticleLabel,
      filter: articleFilter,
    },
    relationship: {
      label: UserCreatedArticleLabel,
      filter: {},
    },
    destinationNode: {
      label: UserLabel,
      filter: {},
    },
  });

export const deleteArticleCreatedBy = async (
  authorFilter: { _id: string } | { key: string },
  articleFilter: { key: string } | { _id: string }
): Promise<{ deletedCount: number }> =>
  deleteRelatedNode<User, UserCreatedArticle, Article>({
    originNode: {
      label: UserLabel,
      filter: authorFilter,
    },
    relationship: {
      label: UserCreatedArticleLabel,
      filter: {},
    },
    destinationNode: {
      label: ArticleLabel,
      filter: articleFilter,
    },
  });
