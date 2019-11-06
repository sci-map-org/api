import { ArticleNotFoundError } from '../../errors/NotFoundError';
import {
  Article,
  createArticle,
  CreateArticleData,
  findArticleById,
  findArticleByKey,
  updateArticle,
  findArticles,
} from '../../repositories/articles.repository';
import { UnauthenticatedError, UnauthorizedError } from '../errors/UnauthenticatedError';
import { APIArticle, APIMutationResolvers, APIQueryResolvers } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';

function toAPIArticle(article: Article): APIArticle {
  return article;
}

export const createArticleResolver: APIMutationResolvers['createArticle'] = async (_parent, { payload }, ctx) => {
  if (!ctx.user) throw new UnauthenticatedError('Must be logged in to create an article');
  const data: CreateArticleData = { ...payload, authorId: ctx.user._id };
  return toAPIArticle(await createArticle(data));
};

export const listArticlesResolver: APIQueryResolvers['listArticles'] = async (_, { options }) => {
  const { filter, pagination } = nullToUndefined(options);
  const articles = await findArticles(filter || {}, pagination);
  return { items: articles.map(toAPIArticle) };
};

export const getArticleResolver: APIQueryResolvers['getArticle'] = async (_parent, { key }, ctx) => {
  const article = await findArticleByKey(key);

  if (!article) throw new ArticleNotFoundError(key, 'key');

  return toAPIArticle(article);
};

export const updateArticleResolver: APIMutationResolvers['updateArticle'] = async (_parent, { id, payload }, ctx) => {
  if (!ctx.user) throw new UnauthenticatedError('Must be logged in to create an article');

  const article = await findArticleById(id);

  if (!article) throw new ArticleNotFoundError(id, 'id');

  if (article.authorId !== ctx.user._id) throw new UnauthorizedError();

  const updatedArticle = await updateArticle(id, nullToUndefined(payload));

  return toAPIArticle(updatedArticle);
};
