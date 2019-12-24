import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';

import {
  createArticleResolver,
  deleteArticleResolver,
  getArticleAuthorResolver,
  getArticleByKeyResolver,
  listArticlesResolver,
  updateArticleResolver,
} from './resolvers/articles.resolvers';
import {
  createDomainResolver,
  deleteDomainResolver,
  getDomainByKeyResolver,
  updateDomainResolver,
  searchDomainsResolver,
  getDomainConceptsResolver,
} from './resolvers/domains.resolvers';
import {
  adminUpdateUserResolver,
  currentUserResolver,
  getCurrentUserCreatedArticlesResolver,
  getUserResolver,
  getUserCreatedArticlesResolver,
  loginResolver,
  registerResolver,
} from './resolvers/users.resolvers';
import { APIResolvers } from './schema/types';
import { APIContext } from './server';
import {
  createResourceResolver,
  getResourceByIdResolver,
  addResourceToDomainResolver,
  attachResourceToDomainResolver,
} from './resolvers/resources.resolvers';
import {
  addConceptToDomainResolver,
  getConceptResolver,
  updateConceptResolver,
  deleteConceptResolver,
} from './resolvers/concepts.resolvers';

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
    createResource: createResourceResolver,
    addResourceToDomain: addResourceToDomainResolver,
    attachResourceToDomain: attachResourceToDomainResolver,
    addConceptToDomain: addConceptToDomainResolver,
    updateConcept: updateConceptResolver,
    deleteConcept: deleteConceptResolver,
  },
  Query: {
    currentUser: currentUserResolver,
    getArticleByKey: getArticleByKeyResolver,
    listArticles: listArticlesResolver,
    getUser: getUserResolver,
    searchDomains: searchDomainsResolver,
    getDomainByKey: getDomainByKeyResolver,
    getResourceById: getResourceByIdResolver,
    getConcept: getConceptResolver,
  },
  Article: {
    author: getArticleAuthorResolver,
  },
  User: {
    articles: getUserCreatedArticlesResolver,
  },
  CurrentUser: {
    articles: getCurrentUserCreatedArticlesResolver,
  },
  Domain: {
    concepts: getDomainConceptsResolver,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
