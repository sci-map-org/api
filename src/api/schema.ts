import { makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLScalarType } from 'graphql';
import { importSchema } from 'graphql-import';
import { TopicType } from '../entities/Topic';
import { getLearningGoalRating } from '../repositories/learning_goals.repository';
import {
  createArticleResolver,
  deleteArticleResolver,
  getArticleAuthorResolver,
  getArticleByKeyResolver,
  listArticlesResolver,
  updateArticleResolver,
} from './resolvers/articles.resolvers';
import {
  addConceptBelongsToConceptResolver,
  addConceptReferencesConceptResolver,
  addConceptToDomainResolver,
  deleteConceptResolver,
  getConceptCoveredByResourcesResolver,
  getConceptDomainResolver,
  getConceptKnownResolver,
  getConceptParentConceptsResolver,
  getConceptReferencedByConceptsResolver,
  getConceptReferencingConceptsResolver,
  getConceptResolver,
  getConceptSubConceptsResolver,
  getDomainConceptByKeyResolver,
  removeConceptBelongsToConceptResolver,
  removeConceptReferencesConceptResolver,
  setConceptsKnownResolver,
  setConceptsUnKnownResolver,
  updateConceptBelongsToDomainResolver,
  updateConceptResolver,
} from './resolvers/concepts.resolvers';
import {
  addDomainBelongsToDomainResolver,
  createDomainResolver,
  deleteDomainResolver,
  getDomainByKeyResolver,
  getDomainConceptsResolver,
  getDomainLearningGoalsResolver,
  getDomainLearningMaterialsResolver,
  getDomainLearningPathsResolver,
  getDomainParentDomainsResolver,
  getDomainResourcesResolver,
  getDomainSubDomainsResolver,
  getDomainSubTopicsResolver,
  removeDomainBelongsToDomainResolver,
  searchDomainsResolver,
  updateDomainResolver,
} from './resolvers/domains.resolvers';
import {
  attachLearningGoalDependencyResolver,
  attachLearningGoalRequiresSubGoalResolver,
  attachLearningGoalToDomainResolver,
  createLearningGoalResolver,
  deleteLearningGoalResolver,
  detachLearningGoalDependencyResolver,
  detachLearningGoalFromDomainResolver,
  detachLearningGoalRequiresSubGoalResolver,
  getDomainLearningGoalByKeyResolver,
  getLearningGoalByKeyResolver,
  getLearningGoalCreatedByResolver,
  getLearningGoalDependantsLearningGoalsResolver,
  getLearningGoalDependsOnLearningGoalsResolver,
  getLearningGoalDomainResolver,
  getLearningGoalProgressResolver,
  getLearningGoalRatingResolver,
  getLearningGoalRelevantLearningMaterialsResolver,
  getLearningGoalRequiredInGoalsResolver,
  getLearningGoalRequiredSubGoalsResolver,
  getLearningGoalStartedByResolver,
  getLearningGoalStartedResolver,
  indexLearningGoalResolver,
  publishLearningGoalResolver,
  rateLearningGoalResolver,
  searchLearningGoalsResolver,
  startLearningGoalResolver,
  updateLearningGoalResolver,
} from './resolvers/learning_goals.resolvers';
import {
  addLearningMaterialOutcomeResolver,
  addLearningMaterialPrerequisiteResolver,
  attachLearningMaterialCoversConceptsResolver,
  attachLearningMaterialToDomainResolver,
  detachLearningMaterialCoversConceptsResolver,
  detachLearningMaterialFromDomainResolver,
  getLearningMaterialOutcomesResolver,
  getLearningMaterialPrerequisitesResolver,
  learningMaterialResolveType,
  rateLearningMaterialResolver,
  removeLearningMaterialOutcomeResolver,
  removeLearningMaterialPrerequisiteResolver,
} from './resolvers/learning_materials.resolvers';
import {
  addTagsToLearningMaterialResolver,
  removeTagsFromLearningMaterialResolver,
  searchLearningMaterialTagsResolver,
} from './resolvers/learning_material_tags.resolvers';
import {
  addComplementaryResourceToLearningPathResolver,
  completeLearningPathResolver,
  createLearningPathResolver,
  deleteLearningPathResolver,
  getLearningPathByKeyResolver,
  getLearningPathComplementaryResourcesResolver,
  getLearningPathCoveredConceptsByDomainResolver,
  getLearningPathCoveredConceptsResolver,
  getLearningPathCreatedByResolver,
  getLearningPathDomainsResolver,
  getLearningPathRatingResolver,
  getLearningPathResolver,
  getLearningPathResourceItemsResolver,
  getLearningPathStartedByResolver,
  getLearningPathStartedResolver,
  getLearningPathTagsResolver,
  removeComplementaryResourceFromLearningPathResolver,
  startLearningPathResolver,
  updateLearningPathResolver,
} from './resolvers/learning_paths.resolvers';
import {
  addSubResourceResolver,
  addSubResourceToSeriesResolver,
  analyzeResourceUrlResolver,
  createResourceResolver,
  createSubResourceSeriesResolver,
  deleteResourceResolver,
  getResourceByIdResolver,
  getResourceConsumedResolver,
  getResourceCoveredConceptsByDomainResolver,
  getResourceCoveredConceptsResolver,
  getResourceCreatorResolver,
  getResourceDomainsResolver,
  getResourceNextResourceResolver,
  getResourceParentResourcesResolver,
  getResourcePreviousResourceResolver,
  getResourceRatingResolver,
  getResourceSeriesParentResourceResolver,
  getResourceSubResourceSeriesResolver,
  getResourceSubResourcesResolver,
  getResourceTagsResolver,
  getResourceUpvotesResolver,
  searchResourcesResolver,
  setResourcesConsumedResolver,
  updateResourceResolver,
  voteResourceResolver,
} from './resolvers/resources.resolvers';
import {
  checkTopicKeyAvailabilityResolver,
  searchSubTopicsResolver,
  searchTopicsResolver,
  topicResolveType,
} from './resolvers/topics.resolvers';
import {
  adminUpdateUserResolver,
  currentUserResolver,
  getCurrentUserCreatedArticlesResolver,
  getCurrentUserCreatedLearningGoalsResolver,
  getCurrentUserCreatedLearningPathsResolver,
  getCurrentUserStartedLearningGoalsResolver,
  getCurrentUserStartedLearningPathsResolver,
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
    updateResource: updateResourceResolver,
    deleteResource: deleteResourceResolver,
    attachLearningMaterialToDomain: attachLearningMaterialToDomainResolver,
    detachLearningMaterialFromDomain: detachLearningMaterialFromDomainResolver,
    addConceptToDomain: addConceptToDomainResolver,
    updateConceptBelongsToDomain: updateConceptBelongsToDomainResolver,
    updateConcept: updateConceptResolver,
    deleteConcept: deleteConceptResolver,
    attachLearningMaterialCoversConcepts: attachLearningMaterialCoversConceptsResolver,
    detachLearningMaterialCoversConcepts: detachLearningMaterialCoversConceptsResolver,
    addTagsToLearningMaterial: addTagsToLearningMaterialResolver,
    removeTagsFromLearningMaterial: removeTagsFromLearningMaterialResolver,
    setConceptsKnown: setConceptsKnownResolver,
    setConceptsUnknown: setConceptsUnKnownResolver,
    setResourcesConsumed: setResourcesConsumedResolver,
    voteResource: voteResourceResolver,
    addConceptReferencesConcept: addConceptReferencesConceptResolver,
    removeConceptReferencesConcept: removeConceptReferencesConceptResolver,
    addConceptBelongsToConcept: addConceptBelongsToConceptResolver,
    removeConceptBelongsToConcept: removeConceptBelongsToConceptResolver,
    addDomainBelongsToDomain: addDomainBelongsToDomainResolver,
    removeDomainBelongsToDomain: removeDomainBelongsToDomainResolver,
    addSubResource: addSubResourceResolver,
    createSubResourceSeries: createSubResourceSeriesResolver,
    addSubResourceToSeries: addSubResourceToSeriesResolver,
    createLearningPath: createLearningPathResolver,
    updateLearningPath: updateLearningPathResolver,
    deleteLearningPath: deleteLearningPathResolver,
    addComplementaryResourceToLearningPath: addComplementaryResourceToLearningPathResolver,
    removeComplementaryResourceFromLearningPath: removeComplementaryResourceFromLearningPathResolver,
    startLearningPath: startLearningPathResolver,
    completeLearningPath: completeLearningPathResolver,
    rateLearningMaterial: rateLearningMaterialResolver,
    createLearningGoal: createLearningGoalResolver,
    updateLearningGoal: updateLearningGoalResolver,
    deleteLearningGoal: deleteLearningGoalResolver,
    attachLearningGoalToDomain: attachLearningGoalToDomainResolver,
    detachLearningGoalFromDomain: detachLearningGoalFromDomainResolver,
    addLearningMaterialPrerequisite: addLearningMaterialPrerequisiteResolver,
    removeLearningMaterialPrerequisite: removeLearningMaterialPrerequisiteResolver,
    addLearningMaterialOutcome: addLearningMaterialOutcomeResolver,
    removeLearningMaterialOutcome: removeLearningMaterialOutcomeResolver,
    attachLearningGoalRequiresSubGoal: attachLearningGoalRequiresSubGoalResolver,
    detachLearningGoalRequiresSubGoal: detachLearningGoalRequiresSubGoalResolver,
    startLearningGoal: startLearningGoalResolver,
    publishLearningGoal: publishLearningGoalResolver,
    indexLearningGoal: indexLearningGoalResolver,
    rateLearningGoal: rateLearningGoalResolver,
    attachLearningGoalDependency: attachLearningGoalDependencyResolver,
    detachLearningGoalDependency: detachLearningGoalDependencyResolver,
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
    getDomainConceptByKey: getDomainConceptByKeyResolver,
    searchLearningMaterialTags: searchLearningMaterialTagsResolver,
    searchResources: searchResourcesResolver,
    getLearningPath: getLearningPathResolver,
    getLearningPathByKey: getLearningPathByKeyResolver,
    getLearningGoalByKey: getLearningGoalByKeyResolver,
    getDomainLearningGoalByKey: getDomainLearningGoalByKeyResolver,
    searchLearningGoals: searchLearningGoalsResolver,
    searchTopics: searchTopicsResolver,
    searchSubTopics: searchSubTopicsResolver,
    checkTopicKeyAvailability: checkTopicKeyAvailabilityResolver,
    analyzeResourceUrl: analyzeResourceUrlResolver,
  },
  Article: {
    author: getArticleAuthorResolver,
  },
  User: {
    articles: getUserCreatedArticlesResolver,
  },
  CurrentUser: {
    articles: getCurrentUserCreatedArticlesResolver,
    createdLearningPaths: getCurrentUserCreatedLearningPathsResolver,
    startedLearningPaths: getCurrentUserStartedLearningPathsResolver,
    createdLearningGoals: getCurrentUserCreatedLearningGoalsResolver,
    startedLearningGoals: getCurrentUserStartedLearningGoalsResolver,
  },
  Domain: {
    concepts: getDomainConceptsResolver,
    resources: getDomainResourcesResolver,
    subDomains: getDomainSubDomainsResolver,
    parentDomains: getDomainParentDomainsResolver,
    learningPaths: getDomainLearningPathsResolver,
    learningMaterials: getDomainLearningMaterialsResolver,
    learningGoals: getDomainLearningGoalsResolver,
    subTopics: getDomainSubTopicsResolver,
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
    coveredConceptsByDomain: getResourceCoveredConceptsByDomainResolver,
    domains: getResourceDomainsResolver,
    tags: getResourceTagsResolver,
    upvotes: getResourceUpvotesResolver,
    rating: getResourceRatingResolver,
    consumed: getResourceConsumedResolver,
    creator: getResourceCreatorResolver,
    subResources: getResourceSubResourcesResolver,
    parentResources: getResourceParentResourcesResolver,
    seriesParentResource: getResourceSeriesParentResourceResolver,
    subResourceSeries: getResourceSubResourceSeriesResolver,
    previousResource: getResourcePreviousResourceResolver,
    nextResource: getResourceNextResourceResolver,
    prerequisites: getLearningMaterialPrerequisitesResolver,
    outcomes: getLearningMaterialOutcomesResolver,
  },
  LearningPath: {
    resourceItems: getLearningPathResourceItemsResolver,
    complementaryResources: getLearningPathComplementaryResourcesResolver,
    rating: getLearningPathRatingResolver,
    tags: getLearningPathTagsResolver,
    domains: getLearningPathDomainsResolver,
    coveredConcepts: getLearningPathCoveredConceptsResolver,
    coveredConceptsByDomain: getLearningPathCoveredConceptsByDomainResolver,
    started: getLearningPathStartedResolver,
    createdBy: getLearningPathCreatedByResolver,
    startedBy: getLearningPathStartedByResolver,
    prerequisites: getLearningMaterialPrerequisitesResolver,
    outcomes: getLearningMaterialOutcomesResolver,
  },
  LearningGoal: {
    domain: getLearningGoalDomainResolver,
    requiredSubGoals: getLearningGoalRequiredSubGoalsResolver,
    requiredInGoals: getLearningGoalRequiredInGoalsResolver,
    createdBy: getLearningGoalCreatedByResolver,
    started: getLearningGoalStartedResolver,
    startedBy: getLearningGoalStartedByResolver,
    progress: getLearningGoalProgressResolver,
    rating: getLearningGoalRatingResolver,
    relevantLearningMaterials: getLearningGoalRelevantLearningMaterialsResolver,
    dependsOnLearningGoals: getLearningGoalDependsOnLearningGoalsResolver,
    dependantLearningGoals: getLearningGoalDependantsLearningGoalsResolver,
  },
  LearningMaterial: {
    __resolveType: learningMaterialResolveType,
  },
  Topic: {
    __resolveType: topicResolveType,
  },
  SubGoal: {
    __resolveType: obj => {
      if (obj.topicType === TopicType.Concept) return 'Concept';
      if (obj.topicType === TopicType.LearningGoal) return 'LearningGoal';
      throw new Error('Unreachable code, issue in returning SubGoal which isnt a Concept or LG');
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      'Date scalar serialized as ISO UTC string, parsed from JS Date time (ms since Unix epoch, from Date.now() or new Date().getTime()',
    serialize(value: number) {
      return new Date(value).toISOString();
    },
    parseValue(value: string) {
      return new Date(value).getTime();
    },
    parseLiteral(ast) {
      ast.kind === 'StringValue' ? new Date(ast.value).getTime() : undefined;
    },
  }),
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
