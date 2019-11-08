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
import * as TE from 'fp-ts/lib/TaskEither';
import { identity } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { of } from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { APIContext } from '../server';

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

// export const getArticleResolver: APIQueryResolvers['getArticle'] = async (_parent, { key }, ctx) => {
//   const article = await findArticleByKey(key);

//   if (!article) throw new ArticleNotFoundError(key, 'key');

//   return toAPIArticle(article);
// };

// map(map(toAPIArticle))(findArticleByKey(key))()

// const throwIfNotFound = (article: Article) => {
//   if (!article) throw new Error();
//   return article;
// };

// export const getArticleResolver: APIQueryResolvers['getArticle'] = (_parent, { key }, ctx) => {
//   pipe(
//     findArticleByKey,
//     throwIfNotFound,

//     // O.map(TE.map(toAPIArticle))
//   )(key);
// };
class InternalServerError extends Error {
  constructor(m: string) {
    super(m);
  }
}

const catchError = <E, T>(t: TE.TaskEither<E, T>): T.Task<T> =>
  TE.fold<E, T, T>(
    (e: E) => {
      throw new InternalServerError(JSON.stringify(e));
    },
    (f: T) => {
      return T.of(f);
    }
  )(t);

// const throwIfNotFound = <T>(t: O.Option<T>): T => {
//   return O.fold<T, T>(
//     () => {
//       throw new ArticleNotFoundError('test', 'key');
//     },
//     (a: T) => {
//       return a;
//     }
//   )(t);
// };

const handleNotFound = <E extends Error, T>(
  t: TE.TaskEither<E, O.Option<T>>
): TE.TaskEither<E | ArticleNotFoundError, T> => {
  return TE.chain(
    O.fold<T, TE.TaskEither<E | ArticleNotFoundError, T>>(
      () => TE.left<E | ArticleNotFoundError, T>(new ArticleNotFoundError('test', 'key')),
      (a: T) => TE.right<E, T>(a)
    )
  )(t);
};

// export const getArticleResolver: APIQueryResolvers['getArticle'] = (_parent, { key }, ctx) =>
//   pipe(
//     findArticleByKey(key),
//     TE.fold<Error, O.Option<Article>, APIArticle>(
//       (e: Error) => {
//         throw new InternalServerError(e.message);
//       },
//       (article: O.Option<Article>) => {
//         return O.fold<Article, T.Task<APIArticle>>(
//           () => {
//             throw new ArticleNotFoundError(key, 'key');
//           },
//           (a: Article) => {
//             return T.of(toAPIArticle(a));
//           }
//         )(article);
//       }
//     )
//   )();

export const getArticleResolver: APIQueryResolvers['getArticle'] = (_parent, { key }, ctx) =>
  pipe(
    findArticleByKey(key),
    // catchError,
    handleNotFound,
    TE.map(toAPIArticle),
    TE.getOrElse(e => {
      throw e;
    })
  )();

const x = O.fold<Article, APIArticle>(
  () => {
    throw new ArticleNotFoundError('tes§', 'key');
  },
  (a: Article) => {
    return toAPIArticle(a);
  }
);
// export const getArticleResolver: APIQueryResolvers['getArticle'] =  (_parent, { key }, ctx) => {
//   const article = await findArticleByKey(key);

//   if (!article) throw new ArticleNotFoundError(key, 'key');

//   return toAPIArticle(article);
// };

// map(identity)(findArticleByKey('test'));

const checkUserLoggedIn = (user?: APIContext['user']) => {};
// export const updateArticleResolver: APIMutationResolvers['updateArticle'] = async (_parent, { id, payload }, ctx) => {
//   if (!ctx.user) throw new UnauthenticatedError('Must be logged in to create an article');

//   const article = await findArticleById(id);

//   if (!article) throw new ArticleNotFoundError(id, 'id');

//   if (article.authorId !== ctx.user._id) throw new UnauthorizedError();

//   const updatedArticle = await updateArticle(id, nullToUndefined(payload));

//   return toAPIArticle(updatedArticle);
// };
