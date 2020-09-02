import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { GraphQLDateTime } from 'graphql-iso-date';
import { augmentSchema } from 'neo4j-graphql-js';
import {
  createArticleResolver,
  deleteArticleResolver,
  getArticleAuthorResolver,
  getArticleByKeyResolver,
  listArticlesResolver,
  updateArticleResolver,
} from './resolvers/articles.resolvers';
import {
  addConceptReferencesConceptResolver,
  addConceptToDomainResolver,
  deleteConceptResolver,
  getConceptByKeyResolver,
  getConceptCoveredByResourcesResolver,
  getConceptDomainResolver,
  getConceptKnownResolver,
  getConceptReferencedByConceptsResolver,
  getConceptReferencingConceptsResolver,
  getConceptResolver,
  removeConceptReferencesConceptResolver,
  setConceptsKnownResolver,
  setConceptsUnKnownResolver,
  updateConceptBelongsToDomainResolver,
  updateConceptResolver,
  getConceptSubConceptsResolver,
  getConceptParentConceptsResolver,
  removeConceptBelongsToConceptResolver,
  addConceptBelongsToConceptResolver,
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
  deleteResourceResolver,
  detachResourceCoversConceptsResolver,
  getResourceByIdResolver,
  getResourceConsumedResolver,
  getResourceCoveredConceptsResolver,
  getResourceCreatorResolver,
  getResourceDomainsResolver,
  getResourceRatingResolver,
  getResourceTagsResolver,
  getResourceUpvotesResolver,
  rateResourceResolver,
  setResourcesConsumedResolver,
  updateResourceResolver,
  voteResourceResolver,
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
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

// export const typeDefs = importSchema('./src/api/schema/schema.graphql');
const schemaWithoutResolvers = loadSchemaSync('./src/api/schema/newSchema.graphql', {
  //join(__dirname, 'schema/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
  assumeValidSDL: true,
});

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
    rateResource: rateResourceResolver,
    addConceptReferencesConcept: addConceptReferencesConceptResolver,
    removeConceptReferencesConcept: removeConceptReferencesConceptResolver,
    addConceptBelongsToConcept: addConceptBelongsToConceptResolver,
    removeConceptBelongsToConcept: removeConceptBelongsToConceptResolver,
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
    subConcepts: getConceptSubConceptsResolver,
    parentConcepts: getConceptParentConceptsResolver,
  },
  Resource: {
    coveredConcepts: getResourceCoveredConceptsResolver,
    domains: getResourceDomainsResolver,
    tags: getResourceTagsResolver,
    upvotes: getResourceUpvotesResolver,
    rating: getResourceRatingResolver,
    consumed: getResourceConsumedResolver,
    creator: getResourceCreatorResolver,
  },
  Date: GraphQLDateTime,
};

export const schema = augmentSchema(
  schemaWithoutResolvers
  // addResolversToSchema({
  //   schema: ,
  //   resolvers,
  // })
);
// export const schema = makeAugmentedSchema({ typeDefs });
