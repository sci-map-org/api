import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';

import {
  getArticleResolver,
  createArticleResolver,
  updateArticleResolver,
  listArticlesResolver,
  getArticleAuthorResolver,
} from './resolvers/articles.resolvers';
import {
  currentUserResolver,
  loginResolver,
  registerResolver,
  getWrittenArticlesResolver,
  getCurrentUserWrittenArticlesResolver,
} from './resolvers/users.resolvers';
import { APIResolvers } from './schema/types';
import { APIContext } from './server';

export const typeDefs = importSchema('./src/api/schema/schema.graphql');

const resolvers: APIResolvers<APIContext> = {
  Mutation: {
    login: loginResolver,
    register: registerResolver,
    updateArticle: updateArticleResolver,
    createArticle: createArticleResolver,
  },
  Query: {
    currentUser: currentUserResolver,
    getArticle: getArticleResolver,
    listArticles: listArticlesResolver,
  },
  Article: {
    author: getArticleAuthorResolver,
  },
  User: {
    articles: getWrittenArticlesResolver,
  },
  CurrentUser: {
    articles: getCurrentUserWrittenArticlesResolver,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
