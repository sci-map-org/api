import { generate } from 'shortid';
import * as shortid from 'shortid';

import { ArticleNotFoundError } from '../errors/NotFoundError';
import { neo4jDriver } from '../infra/neo4j';
import { createNode, findOne, getFilterString } from './util/abstract_graph_repo';

export enum ArticleContentType {
  Markdown = 'markdown',
}

export interface Article {
  _id: string;
  key: string;
  contentType: ArticleContentType;
  title: string;
  content: string;
  authorId: string;
}

export interface CreateArticleData {
  contentType: ArticleContentType;
  title: string;
  content: string;
  authorId: string;
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

export const findArticles = async (
  filter: { authorId?: string },
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
