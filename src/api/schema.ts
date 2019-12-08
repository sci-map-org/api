import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';

import {
  createArticleResolver,
  deleteArticleResolver,
  getArticleAuthorResolver,
  getArticleResolver,
  listArticlesResolver,
  updateArticleResolver,
} from './resolvers/articles.resolvers';
import {
  createDomainResolver,
  deleteDomainResolver,
  getDomainByKeyResolver,
  updateDomainResolver,
} from './resolvers/domains.resolvers';
import {
  adminUpdateUserResolver,
  currentUserResolver,
  getCurrentUserWrittenArticlesResolver,
  getUserResolver,
  getUserWrittenArticlesResolver,
  loginResolver,
  registerResolver,
} from './resolvers/users.resolvers';
import { APIResolvers } from './schema/types';
import { APIContext } from './server';

export const typeDefs = importSchema('./src/api/schema/schema.graphql');

const resolvers: APIResolvers<APIContext> = {
  Mutation: {
    login: loginResolver,
    register: registerResolver,
    adminUpdateUser: adminUpdateUserResolver,
    updateArticle: updateArticleResolver,
    createArticle: createArticleResolver,
    deleteArticle: deleteArticleResolver,
    createDomain: createDomainResolver,
    updateDomain: updateDomainResolver,
    deleteDomain: deleteDomainResolver,
  },
  Query: {
    currentUser: currentUserResolver,
    getArticle: getArticleResolver,
    listArticles: listArticlesResolver,
    getUser: getUserResolver,
    getDomainByKey: getDomainByKeyResolver,
  },
  Article: {
    author: getArticleAuthorResolver,
  },
  User: {
    articles: getUserWrittenArticlesResolver,
  },
  CurrentUser: {
    articles: getCurrentUserWrittenArticlesResolver,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
