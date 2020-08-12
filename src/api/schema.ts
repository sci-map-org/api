import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { GraphQLDateTime } from 'graphql-iso-date';
import {
  createArticleResolver,
  deleteArticleResolver,
  getArticleAuthorResolver,
  getArticleByKeyResolver,
  listArticlesResolver,
  updateArticleResolver,
} from './resolvers/articles.resolvers';
import {
  addConceptToDomainResolver,
  deleteConceptResolver,
  getConceptByKeyResolver,
  getConceptCoveredByResourcesResolver,
  getConceptDomainResolver,
  getConceptKnownResolver,
  getConceptResolver,
  setConceptsKnownResolver,
  setConceptsUnKnownResolver,
  updateConceptBelongsToDomainResolver,
  updateConceptResolver,
  addConceptReferencesConceptResolver,
  removeConceptReferencesConceptResolver,
  getConceptReferencingConceptsResolver,
  getConceptReferencedByConceptsResolver,
} from './resolvers/concepts.resolvers';
import {
  createDomainResolver,
  deleteDomainResolver,
  getDomainByKeyResolver,
  getDomainConceptsResolver,
  getDomainResourcesResolver,
  searchDomainsResolver,
  updateDomainResolver,
} from './resolvers/domains.resolvers';
import {
  addResourceToDomainResolver,
  attachResourceCoversConceptsResolver,
  attachResourceToDomainResolver,
  createResourceResolver,
  detachResourceCoversConceptsResolver,
  getResourceByIdResolver,
  getResourceConsumedResolver,
  getResourceCoveredConceptsResolver,
  getResourceDomainsResolver,
  getResourceTagsResolver,
  getResourceUpvotesResolver,
  setResourcesConsumedResolver,
  updateResourceResolver,
  voteResourceResolver,
  deleteResourceResolver,
  getResourceCreatorResolver,
} from './resolvers/resources.resolvers';
import {
  addTagsToResourceResolver,
  removeTagsFromResourceResolver,
  searchResourceTagsResolver,
} from './resolvers/resource_tags.resolvers';
import {
  adminUpdateUserResolver,
  currentUserResolver,
  getCurrentUserCreatedArticlesResolver,
  getUserCreatedArticlesResolver,
  getUserResolver,
  loginGoogleResolver,
  loginResolver,
  registerGoogleResolver,
  registerResolver,
  verifyEmailAddressResolver,
} from './resolvers/users.resolvers';
import { APIResolvers } from './schema/types';
import { APIContext } from './server';

export const typeDefs = importSchema('./src/api/schema/schema.graphql');

const resolvers: APIResolvers<APIContext> = {
  Mutation: {
    login: loginResolver,
    loginGoogle: loginGoogleResolver,
    register: registerResolver,
    registerGoogle: registerGoogleResolver,
    verifyEmailAddress: verifyEmailAddressResolver,
    adminUpdateUser: adminUpdateUserResolver,
    updateArticle: updateArticleResolver,
    createArticle: createArticleResolver,
    deleteArticle: deleteArticleResolver,
    createDomain: createDomainResolver,
    updateDomain: updateDomainResolver,
    deleteDomain: deleteDomainResolver,
    createResource: createResourceResolver,
    addResourceToDomain: addResourceToDomainResolver,
    updateResource: updateResourceResolver,
    deleteResource: deleteResourceResolver,
    attachResourceToDomain: attachResourceToDomainResolver,
    addConceptToDomain: addConceptToDomainResolver,
    updateConceptBelongsToDomain: updateConceptBelongsToDomainResolver,
    updateConcept: updateConceptResolver,
    deleteConcept: deleteConceptResolver,
    attachResourceCoversConcepts: attachResourceCoversConceptsResolver,
    detachResourceCoversConcepts: detachResourceCoversConceptsResolver,
    addTagsToResource: addTagsToResourceResolver,
    removeTagsFromResource: removeTagsFromResourceResolver,
    setConceptsKnown: setConceptsKnownResolver,
    setConceptsUnknown: setConceptsUnKnownResolver,
    setResourcesConsumed: setResourcesConsumedResolver,
    voteResource: voteResourceResolver,
    addConceptReferencesConcept: addConceptReferencesConceptResolver,
    removeConceptReferencesConcept: removeConceptReferencesConceptResolver,
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
    getConceptByKey: getConceptByKeyResolver,
    searchResourceTags: searchResourceTagsResolver,
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
    resources: getDomainResourcesResolver,
  },
  Concept: {
    domain: getConceptDomainResolver,
    coveredByResources: getConceptCoveredByResourcesResolver,
    known: getConceptKnownResolver,
    referencingConcepts: getConceptReferencingConceptsResolver,
    referencedByConcepts: getConceptReferencedByConceptsResolver,
  },
  Resource: {
    coveredConcepts: getResourceCoveredConceptsResolver,
    domains: getResourceDomainsResolver,
    tags: getResourceTagsResolver,
    upvotes: getResourceUpvotesResolver,
    consumed: getResourceConsumedResolver,
    creator: getResourceCreatorResolver,
  },
  Date: GraphQLDateTime,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
