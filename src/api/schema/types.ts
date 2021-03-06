import { ArticleContentType } from '../../entities/Article';
import { UserRole } from '../../entities/User';
import { ResourceType } from '../../entities/Resource';
import { ResourceMediaType } from '../../entities/Resource';
import { SortingDirection } from '../../repositories/util/sorting';
import { TopicType } from '../../entities/Topic';
import { LearningGoalType } from '../../entities/LearningGoal';
import { ConceptType } from '../../entities/Concept';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { APIContext } from '../server';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: number;
};

export { ArticleContentType };

export type APIArticle = {
   __typename?: 'Article';
  _id: Scalars['String'];
  author?: Maybe<APIUser>;
  content: Scalars['String'];
  contentType: ArticleContentType;
  key: Scalars['String'];
  title: Scalars['String'];
};

export type APIListArticlesFilter = {
  contentType?: Maybe<ArticleContentType>;
};

export type APIListArticlesOptions = {
  filter?: Maybe<APIListArticlesFilter>;
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIListArticlesResult = {
   __typename?: 'ListArticlesResult';
  items: Array<APIArticle>;
};

export type APIQuery = {
   __typename?: 'Query';
  analyzeResourceUrl: APIAnalyzeResourceUrlResult;
  checkTopicKeyAvailability: APICheckTopicKeyAvailabilityResult;
  currentUser?: Maybe<APICurrentUser>;
  getArticleByKey: APIArticle;
  getConcept: APIConcept;
  getDomainByKey: APIDomain;
  getDomainConceptByKey: APIConcept;
  getDomainLearningGoalByKey: APIDomainAndLearningGoalResult;
  getHomePageData: APIGetHomePageDataResults;
  getLearningGoalByKey: APILearningGoal;
  getLearningPath: APILearningPath;
  getLearningPathByKey: APILearningPath;
  getResourceById: APIResource;
  getTopLevelDomains: APIGetTopLevelDomainsResults;
  getTopicById: APIITopic;
  getUser: APIUser;
  globalSearch: APIGlobalSearchResults;
  listArticles: APIListArticlesResult;
  searchDomains: APISearchDomainsResult;
  searchLearningGoals: APISearchLearningGoalsResult;
  searchLearningMaterialTags: Array<APILearningMaterialTagSearchResult>;
  searchResources: APISearchResourcesResult;
  searchSubTopics: APISearchTopicsResult;
  searchTopics: APISearchTopicsResult;
};


export type APIQueryAnalyzeResourceUrlArgs = {
  url: Scalars['String'];
};


export type APIQueryCheckTopicKeyAvailabilityArgs = {
  domainKey?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  topicType: TopicType;
};


export type APIQueryGetArticleByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetConceptArgs = {
  _id: Scalars['String'];
};


export type APIQueryGetDomainByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetDomainConceptByKeyArgs = {
  conceptKey: Scalars['String'];
  domainKey: Scalars['String'];
};


export type APIQueryGetDomainLearningGoalByKeyArgs = {
  domainKey: Scalars['String'];
  learningGoalKey: Scalars['String'];
};


export type APIQueryGetLearningGoalByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetLearningPathArgs = {
  _id: Scalars['String'];
};


export type APIQueryGetLearningPathByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetResourceByIdArgs = {
  id: Scalars['String'];
};


export type APIQueryGetTopicByIdArgs = {
  topicId: Scalars['String'];
};


export type APIQueryGetUserArgs = {
  key: Scalars['String'];
};


export type APIQueryGlobalSearchArgs = {
  options?: Maybe<APIGlobalSearchOptions>;
  query: Scalars['String'];
};


export type APIQueryListArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APIQuerySearchDomainsArgs = {
  options: APISearchDomainsOptions;
};


export type APIQuerySearchLearningGoalsArgs = {
  options: APISearchLearningGoalsOptions;
};


export type APIQuerySearchLearningMaterialTagsArgs = {
  options: APISearchLearningMaterialTagsOptions;
};


export type APIQuerySearchResourcesArgs = {
  options: APISearchResourcesOptions;
  query: Scalars['String'];
};


export type APIQuerySearchSubTopicsArgs = {
  domainId: Scalars['String'];
  options: APISearchTopicsOptions;
};


export type APIQuerySearchTopicsArgs = {
  options: APISearchTopicsOptions;
};

export type APICreateArticlePayload = {
  content: Scalars['String'];
  contentType: ArticleContentType;
  title: Scalars['String'];
};

export type APIUpdateArticlePayload = {
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type APIDeleteArticleResponse = {
   __typename?: 'DeleteArticleResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIMutation = {
   __typename?: 'Mutation';
  addComplementaryResourceToLearningPath: APIComplementaryResourceUpdatedResult;
  addConceptReferencesConcept: APIUpdateConceptReferencesConceptResult;
  addConceptToDomain: APIAddConceptToDomainResult;
  addLearningMaterialOutcome: APILearningMaterial;
  addLearningMaterialPrerequisite: APILearningMaterial;
  addSubResource: APISubResourceCreatedResult;
  addSubResourceToSeries: APISubResourceSeriesCreatedResult;
  addTagsToLearningMaterial: APILearningMaterial;
  adminUpdateUser: APIUser;
  attachLearningGoalDependency: APIUpdateLearningGoalDependenciesResult;
  attachLearningGoalRequiresSubGoal: APIAttachLearningGoalRequiresSubGoalResult;
  attachLearningGoalToDomain: APIDomainAndLearningGoalResult;
  attachLearningMaterialCoversConcepts: APILearningMaterial;
  attachLearningMaterialToDomain: APILearningMaterial;
  attachTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  completeLearningPath: APILearningPathCompletedResult;
  createArticle: APIArticle;
  createDomain: APIDomain;
  createLearningGoal: APILearningGoal;
  createLearningPath: APILearningPath;
  createResource: APIResource;
  createSubResourceSeries: APISubResourceSeriesCreatedResult;
  deleteArticle: APIDeleteArticleResponse;
  deleteConcept: APIDeleteConceptResult;
  deleteDomain: APIDeleteDomainResponse;
  deleteLearningGoal: APIDeleteLearningGoalMutationResult;
  deleteLearningPath: APIDeleteLearningPathResult;
  deleteResource: APIDeleteResourceResponse;
  detachLearningGoalDependency: APIUpdateLearningGoalDependenciesResult;
  detachLearningGoalFromDomain: APIDomainAndLearningGoalResult;
  detachLearningGoalRequiresSubGoal: APIDetachLearningGoalRequiresSubGoalResult;
  detachLearningMaterialCoversConcepts: APILearningMaterial;
  detachLearningMaterialFromDomain: APILearningMaterial;
  detachTopicIsSubTopicOfTopic: APIDetachTopicIsSubTopicOfTopicResult;
  indexLearningGoal: APILearningGoalIndexedResult;
  login: APILoginResponse;
  loginGoogle: APILoginResponse;
  publishLearningGoal: APILearningGoalPublishedResult;
  rateLearningGoal: APILearningGoal;
  rateLearningMaterial: APILearningMaterial;
  register: APICurrentUser;
  registerGoogle: APICurrentUser;
  removeComplementaryResourceFromLearningPath: APIComplementaryResourceUpdatedResult;
  removeConceptReferencesConcept: APIUpdateConceptReferencesConceptResult;
  removeLearningMaterialOutcome: APILearningMaterial;
  removeLearningMaterialPrerequisite: APILearningMaterial;
  removeTagsFromLearningMaterial: APILearningMaterial;
  resetPassword: APIResetPasswordResponse;
  setConceptsKnown: Array<APIConcept>;
  setConceptsUnknown: Array<APIConcept>;
  setResourcesConsumed: Array<APIResource>;
  startLearningGoal: APILearningGoalStartedResult;
  startLearningPath: APILearningPathStartedResult;
  triggerResetPassword: APITriggerResetPasswordResponse;
  updateArticle: APIArticle;
  updateConcept: APIConcept;
  updateConceptBelongsToDomain: APIConceptBelongsToDomain;
  updateCurrentUser: APICurrentUser;
  updateDomain: APIDomain;
  updateLearningGoal: APILearningGoal;
  updateLearningPath: APILearningPath;
  updateResource: APIResource;
  updateTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  verifyEmailAddress: APIVerifyEmailResponse;
  voteResource: APIResource;
};


export type APIMutationAddComplementaryResourceToLearningPathArgs = {
  learningPathId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationAddConceptReferencesConceptArgs = {
  conceptId: Scalars['String'];
  referencedConceptId: Scalars['String'];
};


export type APIMutationAddConceptToDomainArgs = {
  domainId: Scalars['String'];
  parentTopicId: Scalars['String'];
  payload: APIAddConceptToDomainPayload;
};


export type APIMutationAddLearningMaterialOutcomeArgs = {
  learningMaterialId: Scalars['String'];
  outcomeLearningGoalId: Scalars['String'];
};


export type APIMutationAddLearningMaterialPrerequisiteArgs = {
  learningMaterialId: Scalars['String'];
  prerequisiteLearningGoalId: Scalars['String'];
};


export type APIMutationAddSubResourceArgs = {
  parentResourceId: Scalars['String'];
  subResourceId: Scalars['String'];
};


export type APIMutationAddSubResourceToSeriesArgs = {
  parentResourceId: Scalars['String'];
  previousResourceId: Scalars['String'];
  subResourceId: Scalars['String'];
};


export type APIMutationAddTagsToLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationAdminUpdateUserArgs = {
  id: Scalars['String'];
  payload: APIAdminUpdateUserPayload;
};


export type APIMutationAttachLearningGoalDependencyArgs = {
  learningGoalDependencyId: Scalars['String'];
  learningGoalId: Scalars['String'];
  parentLearningGoalId: Scalars['String'];
};


export type APIMutationAttachLearningGoalRequiresSubGoalArgs = {
  learningGoalId: Scalars['String'];
  payload: APIAttachLearningGoalRequiresSubGoalPayload;
  subGoalId: Scalars['String'];
};


export type APIMutationAttachLearningGoalToDomainArgs = {
  domainId: Scalars['String'];
  learningGoalId: Scalars['String'];
  payload: APIAttachLearningGoalToDomainPayload;
};


export type APIMutationAttachLearningMaterialCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  learningMaterialId: Scalars['String'];
};


export type APIMutationAttachLearningMaterialToDomainArgs = {
  domainId: Scalars['String'];
  learningMaterialId: Scalars['String'];
};


export type APIMutationAttachTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
  payload: APIAttachTopicIsSubTopicOfTopicPayload;
};


export type APIMutationCompleteLearningPathArgs = {
  completed: Scalars['Boolean'];
  learningPathId: Scalars['String'];
};


export type APIMutationCreateArticleArgs = {
  payload: APICreateArticlePayload;
};


export type APIMutationCreateDomainArgs = {
  payload: APICreateDomainPayload;
};


export type APIMutationCreateLearningGoalArgs = {
  options?: Maybe<APICreateLearningGoalOptions>;
  payload: APICreateLearningGoalPayload;
};


export type APIMutationCreateLearningPathArgs = {
  payload: APICreateLearningPathPayload;
};


export type APIMutationCreateResourceArgs = {
  payload: APICreateResourcePayload;
};


export type APIMutationCreateSubResourceSeriesArgs = {
  parentResourceId: Scalars['String'];
  subResourceId: Scalars['String'];
};


export type APIMutationDeleteArticleArgs = {
  id: Scalars['String'];
};


export type APIMutationDeleteConceptArgs = {
  _id: Scalars['String'];
};


export type APIMutationDeleteDomainArgs = {
  id: Scalars['String'];
};


export type APIMutationDeleteLearningGoalArgs = {
  _id: Scalars['String'];
};


export type APIMutationDeleteLearningPathArgs = {
  _id: Scalars['String'];
};


export type APIMutationDeleteResourceArgs = {
  _id: Scalars['String'];
};


export type APIMutationDetachLearningGoalDependencyArgs = {
  learningGoalDependencyId: Scalars['String'];
  learningGoalId: Scalars['String'];
  parentLearningGoalId: Scalars['String'];
};


export type APIMutationDetachLearningGoalFromDomainArgs = {
  domainId: Scalars['String'];
  learningGoalId: Scalars['String'];
};


export type APIMutationDetachLearningGoalRequiresSubGoalArgs = {
  learningGoalId: Scalars['String'];
  subGoalId: Scalars['String'];
};


export type APIMutationDetachLearningMaterialCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  learningMaterialId: Scalars['String'];
};


export type APIMutationDetachLearningMaterialFromDomainArgs = {
  domainId: Scalars['String'];
  learningMaterialId: Scalars['String'];
};


export type APIMutationDetachTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
};


export type APIMutationIndexLearningGoalArgs = {
  learningGoalId: Scalars['String'];
};


export type APIMutationLoginArgs = {
  discourseSSO?: Maybe<APIDiscourseSso>;
  email: Scalars['String'];
  password: Scalars['String'];
};


export type APIMutationLoginGoogleArgs = {
  discourseSSO?: Maybe<APIDiscourseSso>;
  idToken: Scalars['String'];
};


export type APIMutationPublishLearningGoalArgs = {
  learningGoalId: Scalars['String'];
};


export type APIMutationRateLearningGoalArgs = {
  learningGoalId: Scalars['String'];
  value: Scalars['Float'];
};


export type APIMutationRateLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  value: Scalars['Float'];
};


export type APIMutationRegisterArgs = {
  payload: APIRegisterPayload;
};


export type APIMutationRegisterGoogleArgs = {
  payload: APIRegisterGooglePayload;
};


export type APIMutationRemoveComplementaryResourceFromLearningPathArgs = {
  learningPathId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationRemoveConceptReferencesConceptArgs = {
  conceptId: Scalars['String'];
  referencedConceptId: Scalars['String'];
};


export type APIMutationRemoveLearningMaterialOutcomeArgs = {
  learningMaterialId: Scalars['String'];
  outcomeLearningGoalId: Scalars['String'];
};


export type APIMutationRemoveLearningMaterialPrerequisiteArgs = {
  learningMaterialId: Scalars['String'];
  prerequisiteLearningGoalId: Scalars['String'];
};


export type APIMutationRemoveTagsFromLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationResetPasswordArgs = {
  payload: APIResetPasswordPayload;
};


export type APIMutationSetConceptsKnownArgs = {
  payload: APISetConceptKnownPayload;
};


export type APIMutationSetConceptsUnknownArgs = {
  conceptIds: Array<Scalars['String']>;
};


export type APIMutationSetResourcesConsumedArgs = {
  payload: APISetResourcesConsumedPayload;
};


export type APIMutationStartLearningGoalArgs = {
  learningGoalId: Scalars['String'];
};


export type APIMutationStartLearningPathArgs = {
  learningPathId: Scalars['String'];
};


export type APIMutationTriggerResetPasswordArgs = {
  email: Scalars['String'];
};


export type APIMutationUpdateArticleArgs = {
  id: Scalars['String'];
  payload: APIUpdateArticlePayload;
};


export type APIMutationUpdateConceptArgs = {
  _id: Scalars['String'];
  payload: APIUpdateConceptPayload;
};


export type APIMutationUpdateConceptBelongsToDomainArgs = {
  conceptId: Scalars['String'];
  domainId: Scalars['String'];
  payload: APIUpdateConceptBelongsToDomainPayload;
};


export type APIMutationUpdateCurrentUserArgs = {
  payload: APIUpdateCurrentUserPayload;
};


export type APIMutationUpdateDomainArgs = {
  id: Scalars['String'];
  payload: APIUpdateDomainPayload;
};


export type APIMutationUpdateLearningGoalArgs = {
  _id: Scalars['String'];
  payload: APIUpdateLearningGoalPayload;
};


export type APIMutationUpdateLearningPathArgs = {
  _id: Scalars['String'];
  payload: APIUpdateLearningPathPayload;
};


export type APIMutationUpdateResourceArgs = {
  _id: Scalars['String'];
  payload: APIUpdateResourcePayload;
};


export type APIMutationUpdateTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
  payload: APIUpdateTopicIsSubTopicOfTopicPayload;
};


export type APIMutationVerifyEmailAddressArgs = {
  token: Scalars['String'];
};


export type APIMutationVoteResourceArgs = {
  resourceId: Scalars['String'];
  value: APIResourceVoteValue;
};

export type APIConcept = APIITopic & {
   __typename?: 'Concept';
  _id: Scalars['String'];
  coveredByResources?: Maybe<APIConceptCoveredByResourcesResults>;
  description?: Maybe<Scalars['String']>;
  domain?: Maybe<APIDomain>;
  key: Scalars['String'];
  known?: Maybe<APIKnownConcept>;
  name: Scalars['String'];
  parentTopic?: Maybe<APITopicIsSubTopicOfTopic>;
  referencedByConcepts?: Maybe<Array<APIConceptReferencesConceptItem>>;
  referencingConcepts?: Maybe<Array<APIConceptReferencesConceptItem>>;
  size?: Maybe<Scalars['Float']>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  topicType: TopicType;
  types: Array<ConceptType>;
};


export type APIConceptCoveredByResourcesArgs = {
  options: APIConceptCoveredByResourcesOptions;
};


export type APIConceptSubTopicsArgs = {
  options: APITopicSubTopicsOptions;
};

export { ConceptType };

export type APIKnownConcept = {
   __typename?: 'KnownConcept';
  level: Scalars['Float'];
};

export type APIConceptReferencesConceptItem = {
   __typename?: 'ConceptReferencesConceptItem';
  concept: APIConcept;
  relationship: APIConceptReferencesConcept;
};

export type APIConceptCoveredByResourcesOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIConceptCoveredByResourcesResults = {
   __typename?: 'ConceptCoveredByResourcesResults';
  items: Array<APIResource>;
};

export type APIAddConceptToDomainPayload = {
  description?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Float']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  types: Array<ConceptType>;
};

export type APIUpdateConceptPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  types?: Maybe<Array<ConceptType>>;
};

export type APISetConceptKnownPayloadConceptsField = {
  conceptId: Scalars['String'];
  level?: Maybe<Scalars['Float']>;
};

export type APISetConceptKnownPayload = {
  concepts: Array<APISetConceptKnownPayloadConceptsField>;
};

export type APIAddConceptToDomainResult = {
   __typename?: 'AddConceptToDomainResult';
  concept: APIConcept;
  domain: APIDomain;
  parentTopic: APIITopic;
};

export type APIDeleteConceptResult = {
   __typename?: 'DeleteConceptResult';
  _id: Scalars['String'];
  domain?: Maybe<APIDomain>;
  success: Scalars['Boolean'];
};

export type APIDomain = APIITopic & {
   __typename?: 'Domain';
  _id: Scalars['String'];
  conceptTotalCount?: Maybe<Scalars['Int']>;
  concepts?: Maybe<APIDomainConceptsResults>;
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  learningGoals?: Maybe<Array<APILearningGoalBelongsToDomain>>;
  learningMaterials?: Maybe<APIDomainLearningMaterialsResults>;
  learningMaterialsTotalCount?: Maybe<Scalars['Int']>;
  learningPaths?: Maybe<APIDomainLearningPathsResults>;
  name: Scalars['String'];
  parentTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  resources?: Maybe<APIDomainResourcesResults>;
  size?: Maybe<Scalars['Float']>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  topicType: TopicType;
};


export type APIDomainConceptsArgs = {
  options: APIDomainConceptsOptions;
};


export type APIDomainLearningMaterialsArgs = {
  options: APIDomainLearningMaterialsOptions;
};


export type APIDomainLearningPathsArgs = {
  options: APIDomainLearningPathsOptions;
};


export type APIDomainParentTopicsArgs = {
  options: APITopicSubTopicsOptions;
};


export type APIDomainResourcesArgs = {
  options: APIDomainResourcesOptions;
};


export type APIDomainSubTopicsArgs = {
  options: APITopicSubTopicsOptions;
};

/** Domain learning paths */
export enum APIDomainLearningPathsSortingFields {
  CreatedAt = 'createdAt'
}

export type APIDomainLearningPathsSortingOptions = {
  direction: SortingDirection;
  field: APIDomainLearningPathsSortingFields;
};

export type APIDomainLearningPathsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
  sorting: APIDomainLearningPathsSortingOptions;
};

export type APIDomainLearningPathsResults = {
   __typename?: 'DomainLearningPathsResults';
  items: Array<APILearningPath>;
};

/** Domain concepts */
export enum APIDomainConceptSortingEntities {
  Concept = 'concept',
  Relationship = 'relationship'
}

export enum APIDomainConceptSortingFields {
  Id = '_id',
  Index = 'index'
}

export type APIDomainConceptSortingOptions = {
  direction: SortingDirection;
  entity: APIDomainConceptSortingEntities;
  field: APIDomainConceptSortingFields;
};

export type APIDomainConceptsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
  sorting?: Maybe<APIDomainConceptSortingOptions>;
};

export type APIDomainConceptsItem = {
   __typename?: 'DomainConceptsItem';
  concept: APIConcept;
  relationship: APIConceptBelongsToDomain;
};

export type APIDomainConceptsResults = {
   __typename?: 'DomainConceptsResults';
  items: Array<APIDomainConceptsItem>;
};

/** Domain resources */
export enum APIDomainResourcesSortingType {
  Newest = 'newest',
  Recommended = 'recommended'
}

export type APIDomainResourcesFilterOptions = {
  consumedByUser: Scalars['Boolean'];
  resourceTypeIn?: Maybe<Array<ResourceType>>;
};

export type APIDomainResourcesOptions = {
  filter: APIDomainResourcesFilterOptions;
  /** pagination: PaginationOptions! # not required yet */
  query?: Maybe<Scalars['String']>;
  sortingType: APIDomainResourcesSortingType;
};

export type APIDomainResourcesResults = {
   __typename?: 'DomainResourcesResults';
  items: Array<APIResource>;
};

/** learning materials */
export enum APIDomainLearningMaterialsSortingType {
  Newest = 'newest',
  Rating = 'rating',
  Recommended = 'recommended'
}

export type APIDomainLearningMaterialsFilterOptions = {
  completedByUser: Scalars['Boolean'];
  learningMaterialTypeIn?: Maybe<Array<APILearningMaterialType>>;
  resourceTypeIn?: Maybe<Array<ResourceType>>;
};

export type APIDomainLearningMaterialsOptions = {
  filter: APIDomainLearningMaterialsFilterOptions;
  query?: Maybe<Scalars['String']>;
  sortingType: APIDomainLearningMaterialsSortingType;
};

export type APIDomainLearningMaterialsResults = {
   __typename?: 'DomainLearningMaterialsResults';
  items: Array<APILearningMaterial>;
};

/** search domains */
export type APISearchDomainsOptions = {
  pagination: APIPaginationOptions;
  query?: Maybe<Scalars['String']>;
};

export type APISearchDomainsResult = {
   __typename?: 'SearchDomainsResult';
  items: Array<APIDomain>;
};

export type APICreateDomainPayload = {
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  name: Scalars['String'];
};

export type APIUpdateDomainPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type APIDeleteDomainResponse = {
   __typename?: 'DeleteDomainResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export { LearningGoalType };

export type APILearningGoal = APIITopic & {
   __typename?: 'LearningGoal';
  _id: Scalars['String'];
  createdBy?: Maybe<APIUser>;
  dependantLearningGoals?: Maybe<Array<APIDependsOnGoalItem>>;
  dependsOnLearningGoals?: Maybe<Array<APIDependsOnGoalItem>>;
  description?: Maybe<Scalars['String']>;
  domain?: Maybe<APILearningGoalBelongsToDomain>;
  hidden: Scalars['Boolean'];
  key: Scalars['String'];
  name: Scalars['String'];
  parentTopic?: Maybe<APITopicIsSubTopicOfTopic>;
  progress?: Maybe<APILearningGoalProgress>;
  publishedAt?: Maybe<Scalars['Date']>;
  rating?: Maybe<Scalars['Float']>;
  relevantLearningMaterials?: Maybe<APILearningGoalRelevantLearningMaterialsResults>;
  requiredInGoals?: Maybe<Array<APIRequiredInGoalItem>>;
  requiredSubGoals?: Maybe<Array<APISubGoalItem>>;
  size?: Maybe<Scalars['Float']>;
  started?: Maybe<APILearningGoalStarted>;
  startedBy?: Maybe<APILearningGoalStartedByResults>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  topicType: TopicType;
  type: LearningGoalType;
};


export type APILearningGoalDependantLearningGoalsArgs = {
  parentLearningGoalIdIn?: Maybe<Array<Scalars['String']>>;
};


export type APILearningGoalDependsOnLearningGoalsArgs = {
  parentLearningGoalIdIn?: Maybe<Array<Scalars['String']>>;
};


export type APILearningGoalRelevantLearningMaterialsArgs = {
  options: APILearningGoalRelevantLearningMaterialsOptions;
};


export type APILearningGoalStartedByArgs = {
  options: APILearningGoalStartedByOptions;
};


export type APILearningGoalSubTopicsArgs = {
  options: APITopicSubTopicsOptions;
};

export type APIDependsOnGoalItem = {
   __typename?: 'DependsOnGoalItem';
  learningGoal: APILearningGoal;
  parentLearningGoalId: Scalars['String'];
};

export type APILearningGoalRelevantLearningMaterialsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningGoalRelevantLearningMaterialsItem = {
   __typename?: 'LearningGoalRelevantLearningMaterialsItem';
  coverage?: Maybe<Scalars['Float']>;
  learningMaterial: APILearningMaterial;
};

export type APILearningGoalRelevantLearningMaterialsResults = {
   __typename?: 'LearningGoalRelevantLearningMaterialsResults';
  count: Scalars['Int'];
  items: Array<APILearningGoalRelevantLearningMaterialsItem>;
};

export type APILearningGoalProgress = {
   __typename?: 'LearningGoalProgress';
  level: Scalars['Float'];
};

export type APILearningGoalStarted = {
   __typename?: 'LearningGoalStarted';
  startedAt: Scalars['Date'];
};

export type APILearningGoalStartedByOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningGoalStartedByResults = {
   __typename?: 'LearningGoalStartedByResults';
  count: Scalars['Int'];
  items: Array<APILearningGoalStartedByItem>;
};

export type APILearningGoalStartedByItem = {
   __typename?: 'LearningGoalStartedByItem';
  startedAt: Scalars['Date'];
  user: APIUser;
};

export type APIRequiredInGoalItem = {
   __typename?: 'RequiredInGoalItem';
  goal: APILearningGoal;
  strength: Scalars['Float'];
};

export type APISubGoalItem = {
   __typename?: 'SubGoalItem';
  strength: Scalars['Float'];
  subGoal: APISubGoal;
};

export type APISubGoal = APIConcept | APILearningGoal;

export type APICreateLearningGoalPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  type: LearningGoalType;
};

export type APICreateLearningGoalOptions = {
  domainId?: Maybe<Scalars['String']>;
  public?: Maybe<Scalars['Boolean']>;
};

export type APIUpdateLearningGoalPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<LearningGoalType>;
};

export type APIAttachLearningGoalToDomainPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIDeleteLearningGoalMutationResult = {
   __typename?: 'DeleteLearningGoalMutationResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDomainAndLearningGoalResult = {
   __typename?: 'DomainAndLearningGoalResult';
  domain: APIDomain;
  learningGoal: APILearningGoal;
};

export type APISearchLearningGoalsOptions = {
  pagination: APIPaginationOptions;
  query?: Maybe<Scalars['String']>;
};

export type APISearchLearningGoalsResult = {
   __typename?: 'SearchLearningGoalsResult';
  items: Array<APILearningGoal>;
};

export type APIAttachLearningGoalRequiresSubGoalPayload = {
  strength?: Maybe<Scalars['Float']>;
};

export type APIAttachLearningGoalRequiresSubGoalResult = {
   __typename?: 'AttachLearningGoalRequiresSubGoalResult';
  learningGoal: APILearningGoal;
  subGoal: APISubGoal;
};

export type APIDetachLearningGoalRequiresSubGoalResult = {
   __typename?: 'DetachLearningGoalRequiresSubGoalResult';
  learningGoal: APILearningGoal;
  subGoal: APISubGoal;
};

export type APILearningGoalStartedResult = {
   __typename?: 'LearningGoalStartedResult';
  currentUser: APICurrentUser;
  learningGoal: APILearningGoal;
};

export type APILearningGoalPublishedResult = {
   __typename?: 'LearningGoalPublishedResult';
  learningGoal: APILearningGoal;
};

export type APILearningGoalIndexedResult = {
   __typename?: 'LearningGoalIndexedResult';
  learningGoal: APILearningGoal;
};

export type APIUpdateLearningGoalDependenciesResult = {
   __typename?: 'UpdateLearningGoalDependenciesResult';
  learningGoal: APILearningGoal;
  learningGoalDependency: APILearningGoal;
  parentLearningGoal: APILearningGoal;
};

export type APILearningMaterial = {
  _id: Scalars['String'];
  coveredConcepts?: Maybe<APILearningMaterialCoveredConceptsResults>;
  coveredConceptsByDomain?: Maybe<Array<APILearningMaterialCoveredConceptsByDomainItem>>;
  domains?: Maybe<Array<APIDomain>>;
  outcomes?: Maybe<Array<APILearningMaterialOutcomeItem>>;
  prerequisites?: Maybe<Array<APILearningMaterialPrerequisiteItem>>;
  rating?: Maybe<Scalars['Float']>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningMaterialCoveredConceptsArgs = {
  options: APILearningMaterialCoveredConceptsOptions;
};

export enum APILearningMaterialType {
  LearningPath = 'LearningPath',
  Resource = 'Resource'
}

export type APILearningMaterialCoveredConceptsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningMaterialCoveredConceptsResults = {
   __typename?: 'LearningMaterialCoveredConceptsResults';
  items: Array<APIConcept>;
};

export type APILearningMaterialCoveredConceptsByDomainItem = {
   __typename?: 'LearningMaterialCoveredConceptsByDomainItem';
  coveredConcepts: Array<APIConcept>;
  domain: APIDomain;
};

export type APILearningMaterialDomainsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningMaterialDomainsResults = {
   __typename?: 'LearningMaterialDomainsResults';
  items: Array<APIDomain>;
};

export type APILearningMaterialPrerequisiteItem = {
   __typename?: 'LearningMaterialPrerequisiteItem';
  createdAt: Scalars['Date'];
  createdBy: Scalars['String'];
  learningGoal: APILearningGoal;
  strength: Scalars['Float'];
};

export type APILearningMaterialOutcomeItem = {
   __typename?: 'LearningMaterialOutcomeItem';
  createdAt: Scalars['Date'];
  createdBy: Scalars['String'];
  learningGoal: APILearningGoal;
  strength: Scalars['Float'];
};

export type APILearningMaterialTag = {
   __typename?: 'LearningMaterialTag';
  name: Scalars['String'];
};

export type APILearningMaterialTagSearchResult = {
   __typename?: 'LearningMaterialTagSearchResult';
  name: Scalars['String'];
  usageCount?: Maybe<Scalars['Int']>;
};

export type APISearchLearningMaterialTagsOptions = {
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APILearningPath = APILearningMaterial & {
   __typename?: 'LearningPath';
  _id: Scalars['String'];
  complementaryResources?: Maybe<Array<APIResource>>;
  coveredConcepts?: Maybe<APILearningMaterialCoveredConceptsResults>;
  coveredConceptsByDomain?: Maybe<Array<APILearningMaterialCoveredConceptsByDomainItem>>;
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  domains?: Maybe<Array<APIDomain>>;
  durationSeconds?: Maybe<Scalars['Int']>;
  key: Scalars['String'];
  name: Scalars['String'];
  outcomes?: Maybe<Array<APILearningMaterialOutcomeItem>>;
  prerequisites?: Maybe<Array<APILearningMaterialPrerequisiteItem>>;
  public: Scalars['Boolean'];
  rating?: Maybe<Scalars['Float']>;
  resourceItems?: Maybe<Array<APILearningPathResourceItem>>;
  started?: Maybe<APILearningPathStarted>;
  startedBy?: Maybe<APILearningPathStartedByResults>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningPathCoveredConceptsArgs = {
  options: APILearningMaterialCoveredConceptsOptions;
};


export type APILearningPathStartedByArgs = {
  options: APILearningPathStartedByOptions;
};

export type APILearningPathStartedByOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningPathStartedByResults = {
   __typename?: 'LearningPathStartedByResults';
  count: Scalars['Int'];
  items: Array<APILearningPathStartedByItem>;
};

export type APILearningPathStartedByItem = {
   __typename?: 'LearningPathStartedByItem';
  completedAt?: Maybe<Scalars['Date']>;
  startedAt: Scalars['Date'];
  user: APIUser;
};

export type APILearningPathResourceItem = {
   __typename?: 'LearningPathResourceItem';
  description?: Maybe<Scalars['String']>;
  learningPathId: Scalars['String'];
  resource: APIResource;
};

export type APILearningPathStarted = {
   __typename?: 'LearningPathStarted';
  completedAt?: Maybe<Scalars['Date']>;
  startedAt: Scalars['Date'];
};

export type APICreateLearningPathPayload = {
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  public?: Maybe<Scalars['Boolean']>;
  resourceItems: Array<APICreateLearningPathResourceItem>;
  tags?: Maybe<Array<Scalars['String']>>;
};

export type APICreateLearningPathResourceItem = {
  description?: Maybe<Scalars['String']>;
  resourceId: Scalars['String'];
};

export type APIDeleteLearningPathResult = {
   __typename?: 'DeleteLearningPathResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIComplementaryResourceUpdatedResult = {
   __typename?: 'ComplementaryResourceUpdatedResult';
  learningPath: APILearningPath;
  resource: APIResource;
};

export type APIUpdateLearningPathPayload = {
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  public?: Maybe<Scalars['Boolean']>;
  resourceItems?: Maybe<Array<APICreateLearningPathResourceItem>>;
};

export type APILearningPathStartedResult = {
   __typename?: 'LearningPathStartedResult';
  learningPath: APILearningPath;
  user: APICurrentUser;
};

export type APILearningPathCompletedResult = {
   __typename?: 'LearningPathCompletedResult';
  learningPath: APILearningPath;
  user: APICurrentUser;
};

export { ResourceMediaType };

export { ResourceType };

export type APIConsumedResource = {
   __typename?: 'ConsumedResource';
  consumedAt?: Maybe<Scalars['Date']>;
  lastOpenedAt?: Maybe<Scalars['Date']>;
  openedAt?: Maybe<Scalars['Date']>;
};

export type APIResource = APILearningMaterial & {
   __typename?: 'Resource';
  _id: Scalars['String'];
  consumed?: Maybe<APIConsumedResource>;
  coveredConcepts?: Maybe<APILearningMaterialCoveredConceptsResults>;
  coveredConceptsByDomain?: Maybe<Array<APILearningMaterialCoveredConceptsByDomainItem>>;
  creator?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  domains?: Maybe<Array<APIDomain>>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  nextResource?: Maybe<APIResource>;
  outcomes?: Maybe<Array<APILearningMaterialOutcomeItem>>;
  parentResources?: Maybe<Array<APIResource>>;
  prerequisites?: Maybe<Array<APILearningMaterialPrerequisiteItem>>;
  previousResource?: Maybe<APIResource>;
  rating?: Maybe<Scalars['Float']>;
  seriesParentResource?: Maybe<APIResource>;
  subResourceSeries?: Maybe<Array<APIResource>>;
  subResources?: Maybe<Array<APIResource>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
  type: ResourceType;
  upvotes?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};


export type APIResourceCoveredConceptsArgs = {
  options: APILearningMaterialCoveredConceptsOptions;
};

export type APIResourceDomainsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIResourceDomainsResults = {
   __typename?: 'ResourceDomainsResults';
  items: Array<APIDomain>;
};

export type APIResourceCoveredConceptsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIResourceCoveredConceptsResults = {
   __typename?: 'ResourceCoveredConceptsResults';
  items: Array<APIConcept>;
};

export type APIResourceCoveredConceptsByDomainItem = {
   __typename?: 'ResourceCoveredConceptsByDomainItem';
  domain: APIDomain;
  coveredConcepts: Array<APIConcept>;
};

export type APIDomainAndCoveredConcepts = {
  conceptsIds: Array<Scalars['String']>;
  domainId: Scalars['String'];
};

export type APICreateSubResourcePayload = {
  description?: Maybe<Scalars['String']>;
  domainsAndCoveredConcepts?: Maybe<Array<APIDomainAndCoveredConcepts>>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  outcomesLearningGoalsIds?: Maybe<Array<Scalars['String']>>;
  prerequisitesLearningGoalsIds?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  type: ResourceType;
  url: Scalars['String'];
};

export type APICreateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  domainsAndCoveredConcepts?: Maybe<Array<APIDomainAndCoveredConcepts>>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  outcomesLearningGoalsIds?: Maybe<Array<Scalars['String']>>;
  prerequisitesLearningGoalsIds?: Maybe<Array<Scalars['String']>>;
  subResourceSeries?: Maybe<Array<APICreateSubResourcePayload>>;
  tags?: Maybe<Array<Scalars['String']>>;
  type: ResourceType;
  url: Scalars['String'];
};

export type APIUpdateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType?: Maybe<ResourceMediaType>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<ResourceType>;
  url?: Maybe<Scalars['String']>;
};

export type APISetResourcesConsumedPayloadResourcesField = {
  consumed?: Maybe<Scalars['Boolean']>;
  opened?: Maybe<Scalars['Boolean']>;
  resourceId: Scalars['String'];
};

export type APISetResourcesConsumedPayload = {
  resources: Array<APISetResourcesConsumedPayloadResourcesField>;
};

export enum APIResourceVoteValue {
  Down = 'down',
  Up = 'up'
}

export type APIDeleteResourceResponse = {
   __typename?: 'DeleteResourceResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APISubResourceCreatedResult = {
   __typename?: 'SubResourceCreatedResult';
  parentResource: APIResource;
  subResource: APIResource;
};

export type APISubResourceSeriesCreatedResult = {
   __typename?: 'SubResourceSeriesCreatedResult';
  seriesParentResource: APIResource;
  subResource: APIResource;
};

export type APISearchResourcesOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APISearchResourcesResult = {
   __typename?: 'SearchResourcesResult';
  items: Array<APIResource>;
};

export type APISubResourceExtractedData = {
   __typename?: 'SubResourceExtractedData';
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  type: ResourceType;
  url: Scalars['String'];
};

export type APIResourceData = {
   __typename?: 'ResourceData';
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType?: Maybe<ResourceMediaType>;
  name?: Maybe<Scalars['String']>;
  subResourceSeries?: Maybe<Array<APISubResourceExtractedData>>;
  type?: Maybe<ResourceType>;
};

export type APIAnalyzeResourceUrlResult = {
   __typename?: 'AnalyzeResourceUrlResult';
  resourceData?: Maybe<APIResourceData>;
};

export type APIITopic = {
  _id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  name: Scalars['String'];
  size?: Maybe<Scalars['Float']>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  topicType: TopicType;
};


export type APIITopicSubTopicsArgs = {
  options: APITopicSubTopicsOptions;
};

export enum APITopicSubTopicsSortingType {
  Index = 'index'
}

export type APITopicSubTopicsSortingOptions = {
  direction: SortingDirection;
  type: APITopicSubTopicsSortingType;
};

export type APITopicSubTopicsOptions = {
  sorting: APITopicSubTopicsSortingOptions;
  topicTypeIn?: Maybe<Array<TopicType>>;
};

export { TopicType };

export type APISearchTopicsFilterOptions = {
  topicTypeIn?: Maybe<Array<TopicType>>;
};

export type APISearchTopicsOptions = {
  filter?: Maybe<APISearchTopicsFilterOptions>;
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APISearchTopicsResult = {
   __typename?: 'SearchTopicsResult';
  items: Array<APIITopic>;
};

export type APICheckTopicKeyAvailabilityResult = {
   __typename?: 'CheckTopicKeyAvailabilityResult';
  available: Scalars['Boolean'];
  existingTopic?: Maybe<APIITopic>;
};

export { UserRole };

export type APIUser = {
   __typename?: 'User';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  bio?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  profilePictureUrl?: Maybe<Scalars['String']>;
  role: UserRole;
};


export type APIUserArticlesArgs = {
  options: APIListArticlesOptions;
};

export type APIUserLearningPathsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIUserLearningGoalsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APICurrentUser = {
   __typename?: 'CurrentUser';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  bio?: Maybe<Scalars['String']>;
  consumedResources?: Maybe<APIUserConsumedResourcesResult>;
  createdLearningGoals?: Maybe<Array<APILearningGoalCreatedItem>>;
  /** private stuff here */
  createdLearningPaths?: Maybe<Array<APILearningPath>>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  profilePictureUrl?: Maybe<Scalars['String']>;
  role: UserRole;
  startedLearningGoals?: Maybe<Array<APILearningGoalStartedItem>>;
  startedLearningPaths?: Maybe<Array<APILearningPathStartedItem>>;
};


export type APICurrentUserArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APICurrentUserConsumedResourcesArgs = {
  options: APIUserConsumedResourcesOptions;
};


export type APICurrentUserCreatedLearningGoalsArgs = {
  options: APIUserLearningGoalsOptions;
};


export type APICurrentUserCreatedLearningPathsArgs = {
  options: APIUserLearningPathsOptions;
};


export type APICurrentUserStartedLearningGoalsArgs = {
  options: APIUserLearningGoalsOptions;
};


export type APICurrentUserStartedLearningPathsArgs = {
  options: APIUserLearningPathsOptions;
};

export type APIUserConsumedResourcesResult = {
   __typename?: 'UserConsumedResourcesResult';
  count: Scalars['Int'];
  items: Array<APIUserConsumedResourceItem>;
};

export type APIUserConsumedResourceItem = {
   __typename?: 'UserConsumedResourceItem';
  consumedAt?: Maybe<Scalars['Date']>;
  lastOpenedAt?: Maybe<Scalars['Date']>;
  openedAt?: Maybe<Scalars['Date']>;
  resource: APIResource;
};

export type APIUserConsumedResourcesFilter = {
  completed?: Maybe<Scalars['Boolean']>;
};

export enum APIUserConsumedResourcesSortingType {
  LastOpened = 'lastOpened'
}

export type APIUserConsumedResourcesOptions = {
  filter?: Maybe<APIUserConsumedResourcesFilter>;
  pagination?: Maybe<APIPaginationOptions>;
  sorting: APIUserConsumedResourcesSortingType;
};

export type APILearningGoalCreatedItem = {
   __typename?: 'LearningGoalCreatedItem';
  createdAt: Scalars['Date'];
  learningGoal: APILearningGoal;
};

export type APILearningGoalStartedItem = {
   __typename?: 'LearningGoalStartedItem';
  learningGoal: APILearningGoal;
  startedAt: Scalars['Date'];
};

export type APILearningPathStartedItem = {
   __typename?: 'LearningPathStartedItem';
  completedAt?: Maybe<Scalars['Date']>;
  learningPath: APILearningPath;
  startedAt: Scalars['Date'];
};

export type APILoginResponse = {
   __typename?: 'LoginResponse';
  currentUser: APICurrentUser;
  jwt: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
};

export type APIRegisterPayload = {
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  password: Scalars['String'];
};

export type APIRegisterGooglePayload = {
  displayName: Scalars['String'];
  idToken: Scalars['String'];
  key: Scalars['String'];
};

export type APIAdminUpdateUserPayload = {
  active?: Maybe<Scalars['Boolean']>;
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  profilePictureUrl?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};

export type APIDiscourseSso = {
  sig: Scalars['String'];
  sso: Scalars['String'];
};

export type APIVerifyEmailResponse = {
   __typename?: 'VerifyEmailResponse';
  email: Scalars['String'];
};

export type APITriggerResetPasswordResponse = {
   __typename?: 'TriggerResetPasswordResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type APIResetPasswordPayload = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type APIResetPasswordResponse = {
   __typename?: 'ResetPasswordResponse';
  currentUser: APICurrentUser;
};

export type APIUpdateCurrentUserPayload = {
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  profilePictureUrl?: Maybe<Scalars['String']>;
};

export type APIGetHomePageDataResults = {
   __typename?: 'GetHomePageDataResults';
  currentUser?: Maybe<APICurrentUser>;
  recommendedLearningGoals: Array<APILearningGoal>;
  recommendedLearningPaths: Array<APILearningPath>;
};

export type APIGlobalSearchOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APISearchResultEntity = APIConcept | APIDomain | APILearningGoal | APILearningPath | APIResource;

export type APISearchResult = {
   __typename?: 'SearchResult';
  entity: APISearchResultEntity;
  score: Scalars['Float'];
};

export type APIGlobalSearchResults = {
   __typename?: 'GlobalSearchResults';
  results: Array<APISearchResult>;
};

export type APIGetTopLevelDomainsResults = {
   __typename?: 'GetTopLevelDomainsResults';
  items: Array<APIDomain>;
};


export type APIUpdateConceptReferencesConceptResult = {
   __typename?: 'UpdateConceptReferencesConceptResult';
  concept: APIConcept;
  referencedConcept: APIConcept;
};

export type APITopicIsSubTopicOfTopic = {
   __typename?: 'TopicIsSubTopicOfTopic';
  index: Scalars['Float'];
  createdAt: Scalars['Date'];
  createdByUserId?: Maybe<Scalars['String']>;
  subTopic: APIITopic;
  parentTopic: APIITopic;
};

export type APIAttachTopicIsSubTopicOfTopicPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIDetachTopicIsSubTopicOfTopicResult = {
   __typename?: 'DetachTopicIsSubTopicOfTopicResult';
  parentTopic: APIITopic;
  subTopic: APIITopic;
};

export type APIConceptBelongsToDomain = {
   __typename?: 'ConceptBelongsToDomain';
  index: Scalars['Float'];
};

export type APIUpdateConceptBelongsToDomainPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIUpdateTopicIsSubTopicOfTopicPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APILearningGoalBelongsToDomain = {
   __typename?: 'LearningGoalBelongsToDomain';
  index: Scalars['Float'];
  domain: APIDomain;
  learningGoal: APILearningGoal;
};

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type APIConceptReferencesConcept = {
   __typename?: 'ConceptReferencesConcept';
  strength: Scalars['Float'];
};

export { SortingDirection };

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type APIResolversTypes = ResolversObject<{
  ArticleContentType: ArticleContentType,
  Article: ResolverTypeWrapper<APIArticle>,
  String: ResolverTypeWrapper<Scalars['String']>,
  ListArticlesFilter: APIListArticlesFilter,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesResult: ResolverTypeWrapper<APIListArticlesResult>,
  Query: ResolverTypeWrapper<{}>,
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  DeleteArticleResponse: ResolverTypeWrapper<APIDeleteArticleResponse>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Mutation: ResolverTypeWrapper<{}>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Concept: ResolverTypeWrapper<APIConcept>,
  ConceptType: ConceptType,
  KnownConcept: ResolverTypeWrapper<APIKnownConcept>,
  ConceptReferencesConceptItem: ResolverTypeWrapper<APIConceptReferencesConceptItem>,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: ResolverTypeWrapper<APIConceptCoveredByResourcesResults>,
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  AddConceptToDomainResult: ResolverTypeWrapper<APIAddConceptToDomainResult>,
  DeleteConceptResult: ResolverTypeWrapper<APIDeleteConceptResult>,
  Domain: ResolverTypeWrapper<APIDomain>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  DomainLearningPathsSortingFields: APIDomainLearningPathsSortingFields,
  DomainLearningPathsSortingOptions: APIDomainLearningPathsSortingOptions,
  DomainLearningPathsOptions: APIDomainLearningPathsOptions,
  DomainLearningPathsResults: ResolverTypeWrapper<APIDomainLearningPathsResults>,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptsItem: ResolverTypeWrapper<APIDomainConceptsItem>,
  DomainConceptsResults: ResolverTypeWrapper<APIDomainConceptsResults>,
  DomainResourcesSortingType: APIDomainResourcesSortingType,
  DomainResourcesFilterOptions: APIDomainResourcesFilterOptions,
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: ResolverTypeWrapper<APIDomainResourcesResults>,
  DomainLearningMaterialsSortingType: APIDomainLearningMaterialsSortingType,
  DomainLearningMaterialsFilterOptions: APIDomainLearningMaterialsFilterOptions,
  DomainLearningMaterialsOptions: APIDomainLearningMaterialsOptions,
  DomainLearningMaterialsResults: ResolverTypeWrapper<APIDomainLearningMaterialsResults>,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: ResolverTypeWrapper<APISearchDomainsResult>,
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: ResolverTypeWrapper<APIDeleteDomainResponse>,
  LearningGoalType: LearningGoalType,
  LearningGoal: ResolverTypeWrapper<APILearningGoal>,
  DependsOnGoalItem: ResolverTypeWrapper<APIDependsOnGoalItem>,
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions,
  LearningGoalRelevantLearningMaterialsItem: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsItem>,
  LearningGoalRelevantLearningMaterialsResults: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsResults>,
  LearningGoalProgress: ResolverTypeWrapper<APILearningGoalProgress>,
  LearningGoalStarted: ResolverTypeWrapper<APILearningGoalStarted>,
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions,
  LearningGoalStartedByResults: ResolverTypeWrapper<APILearningGoalStartedByResults>,
  LearningGoalStartedByItem: ResolverTypeWrapper<APILearningGoalStartedByItem>,
  RequiredInGoalItem: ResolverTypeWrapper<APIRequiredInGoalItem>,
  SubGoalItem: ResolverTypeWrapper<Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>,
  SubGoal: APIResolversTypes['Concept'] | APIResolversTypes['LearningGoal'],
  CreateLearningGoalPayload: APICreateLearningGoalPayload,
  CreateLearningGoalOptions: APICreateLearningGoalOptions,
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload,
  AttachLearningGoalToDomainPayload: APIAttachLearningGoalToDomainPayload,
  DeleteLearningGoalMutationResult: ResolverTypeWrapper<APIDeleteLearningGoalMutationResult>,
  DomainAndLearningGoalResult: ResolverTypeWrapper<APIDomainAndLearningGoalResult>,
  SearchLearningGoalsOptions: APISearchLearningGoalsOptions,
  SearchLearningGoalsResult: ResolverTypeWrapper<APISearchLearningGoalsResult>,
  AttachLearningGoalRequiresSubGoalPayload: APIAttachLearningGoalRequiresSubGoalPayload,
  AttachLearningGoalRequiresSubGoalResult: ResolverTypeWrapper<Omit<APIAttachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>,
  DetachLearningGoalRequiresSubGoalResult: ResolverTypeWrapper<Omit<APIDetachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>,
  LearningGoalStartedResult: ResolverTypeWrapper<APILearningGoalStartedResult>,
  LearningGoalPublishedResult: ResolverTypeWrapper<APILearningGoalPublishedResult>,
  LearningGoalIndexedResult: ResolverTypeWrapper<APILearningGoalIndexedResult>,
  UpdateLearningGoalDependenciesResult: ResolverTypeWrapper<APIUpdateLearningGoalDependenciesResult>,
  LearningMaterial: APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'],
  LearningMaterialType: APILearningMaterialType,
  LearningMaterialCoveredConceptsOptions: APILearningMaterialCoveredConceptsOptions,
  LearningMaterialCoveredConceptsResults: ResolverTypeWrapper<APILearningMaterialCoveredConceptsResults>,
  LearningMaterialCoveredConceptsByDomainItem: ResolverTypeWrapper<APILearningMaterialCoveredConceptsByDomainItem>,
  LearningMaterialDomainsOptions: APILearningMaterialDomainsOptions,
  LearningMaterialDomainsResults: ResolverTypeWrapper<APILearningMaterialDomainsResults>,
  LearningMaterialPrerequisiteItem: ResolverTypeWrapper<APILearningMaterialPrerequisiteItem>,
  LearningMaterialOutcomeItem: ResolverTypeWrapper<APILearningMaterialOutcomeItem>,
  LearningMaterialTag: ResolverTypeWrapper<APILearningMaterialTag>,
  LearningMaterialTagSearchResult: ResolverTypeWrapper<APILearningMaterialTagSearchResult>,
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions,
  LearningPath: ResolverTypeWrapper<APILearningPath>,
  LearningPathStartedByOptions: APILearningPathStartedByOptions,
  LearningPathStartedByResults: ResolverTypeWrapper<APILearningPathStartedByResults>,
  LearningPathStartedByItem: ResolverTypeWrapper<APILearningPathStartedByItem>,
  LearningPathResourceItem: ResolverTypeWrapper<APILearningPathResourceItem>,
  LearningPathStarted: ResolverTypeWrapper<APILearningPathStarted>,
  CreateLearningPathPayload: APICreateLearningPathPayload,
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem,
  DeleteLearningPathResult: ResolverTypeWrapper<APIDeleteLearningPathResult>,
  ComplementaryResourceUpdatedResult: ResolverTypeWrapper<APIComplementaryResourceUpdatedResult>,
  UpdateLearningPathPayload: APIUpdateLearningPathPayload,
  LearningPathStartedResult: ResolverTypeWrapper<APILearningPathStartedResult>,
  LearningPathCompletedResult: ResolverTypeWrapper<APILearningPathCompletedResult>,
  ResourceMediaType: ResourceMediaType,
  ResourceType: ResourceType,
  ConsumedResource: ResolverTypeWrapper<APIConsumedResource>,
  Resource: ResolverTypeWrapper<APIResource>,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: ResolverTypeWrapper<APIResourceDomainsResults>,
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: ResolverTypeWrapper<APIResourceCoveredConceptsResults>,
  ResourceCoveredConceptsByDomainItem: ResolverTypeWrapper<APIResourceCoveredConceptsByDomainItem>,
  DomainAndCoveredConcepts: APIDomainAndCoveredConcepts,
  CreateSubResourcePayload: APICreateSubResourcePayload,
  CreateResourcePayload: APICreateResourcePayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  ResourceVoteValue: APIResourceVoteValue,
  DeleteResourceResponse: ResolverTypeWrapper<APIDeleteResourceResponse>,
  SubResourceCreatedResult: ResolverTypeWrapper<APISubResourceCreatedResult>,
  SubResourceSeriesCreatedResult: ResolverTypeWrapper<APISubResourceSeriesCreatedResult>,
  SearchResourcesOptions: APISearchResourcesOptions,
  SearchResourcesResult: ResolverTypeWrapper<APISearchResourcesResult>,
  SubResourceExtractedData: ResolverTypeWrapper<APISubResourceExtractedData>,
  ResourceData: ResolverTypeWrapper<APIResourceData>,
  AnalyzeResourceUrlResult: ResolverTypeWrapper<APIAnalyzeResourceUrlResult>,
  ITopic: APIResolversTypes['Concept'] | APIResolversTypes['Domain'] | APIResolversTypes['LearningGoal'],
  TopicSubTopicsSortingType: APITopicSubTopicsSortingType,
  TopicSubTopicsSortingOptions: APITopicSubTopicsSortingOptions,
  TopicSubTopicsOptions: APITopicSubTopicsOptions,
  TopicType: TopicType,
  SearchTopicsFilterOptions: APISearchTopicsFilterOptions,
  SearchTopicsOptions: APISearchTopicsOptions,
  SearchTopicsResult: ResolverTypeWrapper<APISearchTopicsResult>,
  CheckTopicKeyAvailabilityResult: ResolverTypeWrapper<APICheckTopicKeyAvailabilityResult>,
  UserRole: UserRole,
  User: ResolverTypeWrapper<APIUser>,
  UserLearningPathsOptions: APIUserLearningPathsOptions,
  UserLearningGoalsOptions: APIUserLearningGoalsOptions,
  CurrentUser: ResolverTypeWrapper<APICurrentUser>,
  UserConsumedResourcesResult: ResolverTypeWrapper<APIUserConsumedResourcesResult>,
  UserConsumedResourceItem: ResolverTypeWrapper<APIUserConsumedResourceItem>,
  UserConsumedResourcesFilter: APIUserConsumedResourcesFilter,
  UserConsumedResourcesSortingType: APIUserConsumedResourcesSortingType,
  UserConsumedResourcesOptions: APIUserConsumedResourcesOptions,
  LearningGoalCreatedItem: ResolverTypeWrapper<APILearningGoalCreatedItem>,
  LearningGoalStartedItem: ResolverTypeWrapper<APILearningGoalStartedItem>,
  LearningPathStartedItem: ResolverTypeWrapper<APILearningPathStartedItem>,
  LoginResponse: ResolverTypeWrapper<APILoginResponse>,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  DiscourseSSO: APIDiscourseSso,
  VerifyEmailResponse: ResolverTypeWrapper<APIVerifyEmailResponse>,
  TriggerResetPasswordResponse: ResolverTypeWrapper<APITriggerResetPasswordResponse>,
  ResetPasswordPayload: APIResetPasswordPayload,
  ResetPasswordResponse: ResolverTypeWrapper<APIResetPasswordResponse>,
  UpdateCurrentUserPayload: APIUpdateCurrentUserPayload,
  GetHomePageDataResults: ResolverTypeWrapper<APIGetHomePageDataResults>,
  GlobalSearchOptions: APIGlobalSearchOptions,
  SearchResultEntity: APIResolversTypes['Concept'] | APIResolversTypes['Domain'] | APIResolversTypes['LearningGoal'] | APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'],
  SearchResult: ResolverTypeWrapper<Omit<APISearchResult, 'entity'> & { entity: APIResolversTypes['SearchResultEntity'] }>,
  GlobalSearchResults: ResolverTypeWrapper<APIGlobalSearchResults>,
  GetTopLevelDomainsResults: ResolverTypeWrapper<APIGetTopLevelDomainsResults>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  UpdateConceptReferencesConceptResult: ResolverTypeWrapper<APIUpdateConceptReferencesConceptResult>,
  TopicIsSubTopicOfTopic: ResolverTypeWrapper<APITopicIsSubTopicOfTopic>,
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload,
  DetachTopicIsSubTopicOfTopicResult: ResolverTypeWrapper<APIDetachTopicIsSubTopicOfTopicResult>,
  ConceptBelongsToDomain: ResolverTypeWrapper<APIConceptBelongsToDomain>,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload,
  LearningGoalBelongsToDomain: ResolverTypeWrapper<APILearningGoalBelongsToDomain>,
  PaginationOptions: APIPaginationOptions,
  ConceptReferencesConcept: ResolverTypeWrapper<APIConceptReferencesConcept>,
  SortingDirection: SortingDirection,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type APIResolversParentTypes = ResolversObject<{
  ArticleContentType: ArticleContentType,
  Article: APIArticle,
  String: Scalars['String'],
  ListArticlesFilter: APIListArticlesFilter,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesResult: APIListArticlesResult,
  Query: {},
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  DeleteArticleResponse: APIDeleteArticleResponse,
  Boolean: Scalars['Boolean'],
  Mutation: {},
  Float: Scalars['Float'],
  Concept: APIConcept,
  ConceptType: ConceptType,
  KnownConcept: APIKnownConcept,
  ConceptReferencesConceptItem: APIConceptReferencesConceptItem,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: APIConceptCoveredByResourcesResults,
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  AddConceptToDomainResult: APIAddConceptToDomainResult,
  DeleteConceptResult: APIDeleteConceptResult,
  Domain: APIDomain,
  Int: Scalars['Int'],
  DomainLearningPathsSortingFields: APIDomainLearningPathsSortingFields,
  DomainLearningPathsSortingOptions: APIDomainLearningPathsSortingOptions,
  DomainLearningPathsOptions: APIDomainLearningPathsOptions,
  DomainLearningPathsResults: APIDomainLearningPathsResults,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptsItem: APIDomainConceptsItem,
  DomainConceptsResults: APIDomainConceptsResults,
  DomainResourcesSortingType: APIDomainResourcesSortingType,
  DomainResourcesFilterOptions: APIDomainResourcesFilterOptions,
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: APIDomainResourcesResults,
  DomainLearningMaterialsSortingType: APIDomainLearningMaterialsSortingType,
  DomainLearningMaterialsFilterOptions: APIDomainLearningMaterialsFilterOptions,
  DomainLearningMaterialsOptions: APIDomainLearningMaterialsOptions,
  DomainLearningMaterialsResults: APIDomainLearningMaterialsResults,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: APISearchDomainsResult,
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: APIDeleteDomainResponse,
  LearningGoalType: LearningGoalType,
  LearningGoal: APILearningGoal,
  DependsOnGoalItem: APIDependsOnGoalItem,
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions,
  LearningGoalRelevantLearningMaterialsItem: APILearningGoalRelevantLearningMaterialsItem,
  LearningGoalRelevantLearningMaterialsResults: APILearningGoalRelevantLearningMaterialsResults,
  LearningGoalProgress: APILearningGoalProgress,
  LearningGoalStarted: APILearningGoalStarted,
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions,
  LearningGoalStartedByResults: APILearningGoalStartedByResults,
  LearningGoalStartedByItem: APILearningGoalStartedByItem,
  RequiredInGoalItem: APIRequiredInGoalItem,
  SubGoalItem: Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] },
  SubGoal: APIResolversParentTypes['Concept'] | APIResolversParentTypes['LearningGoal'],
  CreateLearningGoalPayload: APICreateLearningGoalPayload,
  CreateLearningGoalOptions: APICreateLearningGoalOptions,
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload,
  AttachLearningGoalToDomainPayload: APIAttachLearningGoalToDomainPayload,
  DeleteLearningGoalMutationResult: APIDeleteLearningGoalMutationResult,
  DomainAndLearningGoalResult: APIDomainAndLearningGoalResult,
  SearchLearningGoalsOptions: APISearchLearningGoalsOptions,
  SearchLearningGoalsResult: APISearchLearningGoalsResult,
  AttachLearningGoalRequiresSubGoalPayload: APIAttachLearningGoalRequiresSubGoalPayload,
  AttachLearningGoalRequiresSubGoalResult: Omit<APIAttachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] },
  DetachLearningGoalRequiresSubGoalResult: Omit<APIDetachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] },
  LearningGoalStartedResult: APILearningGoalStartedResult,
  LearningGoalPublishedResult: APILearningGoalPublishedResult,
  LearningGoalIndexedResult: APILearningGoalIndexedResult,
  UpdateLearningGoalDependenciesResult: APIUpdateLearningGoalDependenciesResult,
  LearningMaterial: APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'],
  LearningMaterialType: APILearningMaterialType,
  LearningMaterialCoveredConceptsOptions: APILearningMaterialCoveredConceptsOptions,
  LearningMaterialCoveredConceptsResults: APILearningMaterialCoveredConceptsResults,
  LearningMaterialCoveredConceptsByDomainItem: APILearningMaterialCoveredConceptsByDomainItem,
  LearningMaterialDomainsOptions: APILearningMaterialDomainsOptions,
  LearningMaterialDomainsResults: APILearningMaterialDomainsResults,
  LearningMaterialPrerequisiteItem: APILearningMaterialPrerequisiteItem,
  LearningMaterialOutcomeItem: APILearningMaterialOutcomeItem,
  LearningMaterialTag: APILearningMaterialTag,
  LearningMaterialTagSearchResult: APILearningMaterialTagSearchResult,
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions,
  LearningPath: APILearningPath,
  LearningPathStartedByOptions: APILearningPathStartedByOptions,
  LearningPathStartedByResults: APILearningPathStartedByResults,
  LearningPathStartedByItem: APILearningPathStartedByItem,
  LearningPathResourceItem: APILearningPathResourceItem,
  LearningPathStarted: APILearningPathStarted,
  CreateLearningPathPayload: APICreateLearningPathPayload,
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem,
  DeleteLearningPathResult: APIDeleteLearningPathResult,
  ComplementaryResourceUpdatedResult: APIComplementaryResourceUpdatedResult,
  UpdateLearningPathPayload: APIUpdateLearningPathPayload,
  LearningPathStartedResult: APILearningPathStartedResult,
  LearningPathCompletedResult: APILearningPathCompletedResult,
  ResourceMediaType: ResourceMediaType,
  ResourceType: ResourceType,
  ConsumedResource: APIConsumedResource,
  Resource: APIResource,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: APIResourceDomainsResults,
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: APIResourceCoveredConceptsResults,
  ResourceCoveredConceptsByDomainItem: APIResourceCoveredConceptsByDomainItem,
  DomainAndCoveredConcepts: APIDomainAndCoveredConcepts,
  CreateSubResourcePayload: APICreateSubResourcePayload,
  CreateResourcePayload: APICreateResourcePayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  ResourceVoteValue: APIResourceVoteValue,
  DeleteResourceResponse: APIDeleteResourceResponse,
  SubResourceCreatedResult: APISubResourceCreatedResult,
  SubResourceSeriesCreatedResult: APISubResourceSeriesCreatedResult,
  SearchResourcesOptions: APISearchResourcesOptions,
  SearchResourcesResult: APISearchResourcesResult,
  SubResourceExtractedData: APISubResourceExtractedData,
  ResourceData: APIResourceData,
  AnalyzeResourceUrlResult: APIAnalyzeResourceUrlResult,
  ITopic: APIResolversParentTypes['Concept'] | APIResolversParentTypes['Domain'] | APIResolversParentTypes['LearningGoal'],
  TopicSubTopicsSortingType: APITopicSubTopicsSortingType,
  TopicSubTopicsSortingOptions: APITopicSubTopicsSortingOptions,
  TopicSubTopicsOptions: APITopicSubTopicsOptions,
  TopicType: TopicType,
  SearchTopicsFilterOptions: APISearchTopicsFilterOptions,
  SearchTopicsOptions: APISearchTopicsOptions,
  SearchTopicsResult: APISearchTopicsResult,
  CheckTopicKeyAvailabilityResult: APICheckTopicKeyAvailabilityResult,
  UserRole: UserRole,
  User: APIUser,
  UserLearningPathsOptions: APIUserLearningPathsOptions,
  UserLearningGoalsOptions: APIUserLearningGoalsOptions,
  CurrentUser: APICurrentUser,
  UserConsumedResourcesResult: APIUserConsumedResourcesResult,
  UserConsumedResourceItem: APIUserConsumedResourceItem,
  UserConsumedResourcesFilter: APIUserConsumedResourcesFilter,
  UserConsumedResourcesSortingType: APIUserConsumedResourcesSortingType,
  UserConsumedResourcesOptions: APIUserConsumedResourcesOptions,
  LearningGoalCreatedItem: APILearningGoalCreatedItem,
  LearningGoalStartedItem: APILearningGoalStartedItem,
  LearningPathStartedItem: APILearningPathStartedItem,
  LoginResponse: APILoginResponse,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  DiscourseSSO: APIDiscourseSso,
  VerifyEmailResponse: APIVerifyEmailResponse,
  TriggerResetPasswordResponse: APITriggerResetPasswordResponse,
  ResetPasswordPayload: APIResetPasswordPayload,
  ResetPasswordResponse: APIResetPasswordResponse,
  UpdateCurrentUserPayload: APIUpdateCurrentUserPayload,
  GetHomePageDataResults: APIGetHomePageDataResults,
  GlobalSearchOptions: APIGlobalSearchOptions,
  SearchResultEntity: APIResolversParentTypes['Concept'] | APIResolversParentTypes['Domain'] | APIResolversParentTypes['LearningGoal'] | APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'],
  SearchResult: Omit<APISearchResult, 'entity'> & { entity: APIResolversParentTypes['SearchResultEntity'] },
  GlobalSearchResults: APIGlobalSearchResults,
  GetTopLevelDomainsResults: APIGetTopLevelDomainsResults,
  Date: Scalars['Date'],
  UpdateConceptReferencesConceptResult: APIUpdateConceptReferencesConceptResult,
  TopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic,
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload,
  DetachTopicIsSubTopicOfTopicResult: APIDetachTopicIsSubTopicOfTopicResult,
  ConceptBelongsToDomain: APIConceptBelongsToDomain,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload,
  LearningGoalBelongsToDomain: APILearningGoalBelongsToDomain,
  PaginationOptions: APIPaginationOptions,
  ConceptReferencesConcept: APIConceptReferencesConcept,
  SortingDirection: SortingDirection,
}>;

export type APIArticleResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Article'] = APIResolversParentTypes['Article']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  author?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  content?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  contentType?: Resolver<APIResolversTypes['ArticleContentType'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIListArticlesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ListArticlesResult'] = APIResolversParentTypes['ListArticlesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Article']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIQueryResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Query'] = APIResolversParentTypes['Query']> = ResolversObject<{
  analyzeResourceUrl?: Resolver<APIResolversTypes['AnalyzeResourceUrlResult'], ParentType, ContextType, RequireFields<APIQueryAnalyzeResourceUrlArgs, 'url'>>,
  checkTopicKeyAvailability?: Resolver<APIResolversTypes['CheckTopicKeyAvailabilityResult'], ParentType, ContextType, RequireFields<APIQueryCheckTopicKeyAvailabilityArgs, 'key' | 'topicType'>>,
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>,
  getArticleByKey?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleByKeyArgs, 'key'>>,
  getConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetConceptArgs, '_id'>>,
  getDomainByKey?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIQueryGetDomainByKeyArgs, 'key'>>,
  getDomainConceptByKey?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetDomainConceptByKeyArgs, 'conceptKey' | 'domainKey'>>,
  getDomainLearningGoalByKey?: Resolver<APIResolversTypes['DomainAndLearningGoalResult'], ParentType, ContextType, RequireFields<APIQueryGetDomainLearningGoalByKeyArgs, 'domainKey' | 'learningGoalKey'>>,
  getHomePageData?: Resolver<APIResolversTypes['GetHomePageDataResults'], ParentType, ContextType>,
  getLearningGoalByKey?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIQueryGetLearningGoalByKeyArgs, 'key'>>,
  getLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathArgs, '_id'>>,
  getLearningPathByKey?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByKeyArgs, 'key'>>,
  getResourceById?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByIdArgs, 'id'>>,
  getTopLevelDomains?: Resolver<APIResolversTypes['GetTopLevelDomainsResults'], ParentType, ContextType>,
  getTopicById?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType, RequireFields<APIQueryGetTopicByIdArgs, 'topicId'>>,
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>,
  globalSearch?: Resolver<APIResolversTypes['GlobalSearchResults'], ParentType, ContextType, RequireFields<APIQueryGlobalSearchArgs, 'query'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  searchDomains?: Resolver<APIResolversTypes['SearchDomainsResult'], ParentType, ContextType, RequireFields<APIQuerySearchDomainsArgs, 'options'>>,
  searchLearningGoals?: Resolver<APIResolversTypes['SearchLearningGoalsResult'], ParentType, ContextType, RequireFields<APIQuerySearchLearningGoalsArgs, 'options'>>,
  searchLearningMaterialTags?: Resolver<Array<APIResolversTypes['LearningMaterialTagSearchResult']>, ParentType, ContextType, RequireFields<APIQuerySearchLearningMaterialTagsArgs, 'options'>>,
  searchResources?: Resolver<APIResolversTypes['SearchResourcesResult'], ParentType, ContextType, RequireFields<APIQuerySearchResourcesArgs, 'options' | 'query'>>,
  searchSubTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchSubTopicsArgs, 'domainId' | 'options'>>,
  searchTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchTopicsArgs, 'options'>>,
}>;

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  addComplementaryResourceToLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationAddComplementaryResourceToLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  addConceptReferencesConcept?: Resolver<APIResolversTypes['UpdateConceptReferencesConceptResult'], ParentType, ContextType, RequireFields<APIMutationAddConceptReferencesConceptArgs, 'conceptId' | 'referencedConceptId'>>,
  addConceptToDomain?: Resolver<APIResolversTypes['AddConceptToDomainResult'], ParentType, ContextType, RequireFields<APIMutationAddConceptToDomainArgs, 'domainId' | 'parentTopicId' | 'payload'>>,
  addLearningMaterialOutcome?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddLearningMaterialOutcomeArgs, 'learningMaterialId' | 'outcomeLearningGoalId'>>,
  addLearningMaterialPrerequisite?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddLearningMaterialPrerequisiteArgs, 'learningMaterialId' | 'prerequisiteLearningGoalId'>>,
  addSubResource?: Resolver<APIResolversTypes['SubResourceCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceArgs, 'parentResourceId' | 'subResourceId'>>,
  addSubResourceToSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceToSeriesArgs, 'parentResourceId' | 'previousResourceId' | 'subResourceId'>>,
  addTagsToLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddTagsToLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>,
  attachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>,
  attachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['AttachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'payload' | 'subGoalId'>>,
  attachLearningGoalToDomain?: Resolver<APIResolversTypes['DomainAndLearningGoalResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalToDomainArgs, 'domainId' | 'learningGoalId' | 'payload'>>,
  attachLearningMaterialCoversConcepts?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialCoversConceptsArgs, 'conceptIds' | 'learningMaterialId'>>,
  attachLearningMaterialToDomain?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialToDomainArgs, 'domainId' | 'learningMaterialId'>>,
  attachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationAttachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId' | 'payload'>>,
  completeLearningPath?: Resolver<APIResolversTypes['LearningPathCompletedResult'], ParentType, ContextType, RequireFields<APIMutationCompleteLearningPathArgs, 'completed' | 'learningPathId'>>,
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>,
  createDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationCreateDomainArgs, 'payload'>>,
  createLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationCreateLearningGoalArgs, 'payload'>>,
  createLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationCreateLearningPathArgs, 'payload'>>,
  createResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationCreateResourceArgs, 'payload'>>,
  createSubResourceSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationCreateSubResourceSeriesArgs, 'parentResourceId' | 'subResourceId'>>,
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>,
  deleteConcept?: Resolver<APIResolversTypes['DeleteConceptResult'], ParentType, ContextType, RequireFields<APIMutationDeleteConceptArgs, '_id'>>,
  deleteDomain?: Resolver<APIResolversTypes['DeleteDomainResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteDomainArgs, 'id'>>,
  deleteLearningGoal?: Resolver<APIResolversTypes['DeleteLearningGoalMutationResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningGoalArgs, '_id'>>,
  deleteLearningPath?: Resolver<APIResolversTypes['DeleteLearningPathResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningPathArgs, '_id'>>,
  deleteResource?: Resolver<APIResolversTypes['DeleteResourceResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteResourceArgs, '_id'>>,
  detachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>,
  detachLearningGoalFromDomain?: Resolver<APIResolversTypes['DomainAndLearningGoalResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalFromDomainArgs, 'domainId' | 'learningGoalId'>>,
  detachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['DetachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'subGoalId'>>,
  detachLearningMaterialCoversConcepts?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialCoversConceptsArgs, 'conceptIds' | 'learningMaterialId'>>,
  detachLearningMaterialFromDomain?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialFromDomainArgs, 'domainId' | 'learningMaterialId'>>,
  detachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['DetachTopicIsSubTopicOfTopicResult'], ParentType, ContextType, RequireFields<APIMutationDetachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId'>>,
  indexLearningGoal?: Resolver<APIResolversTypes['LearningGoalIndexedResult'], ParentType, ContextType, RequireFields<APIMutationIndexLearningGoalArgs, 'learningGoalId'>>,
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  loginGoogle?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginGoogleArgs, 'idToken'>>,
  publishLearningGoal?: Resolver<APIResolversTypes['LearningGoalPublishedResult'], ParentType, ContextType, RequireFields<APIMutationPublishLearningGoalArgs, 'learningGoalId'>>,
  rateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationRateLearningGoalArgs, 'learningGoalId' | 'value'>>,
  rateLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRateLearningMaterialArgs, 'learningMaterialId' | 'value'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
  registerGoogle?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterGoogleArgs, 'payload'>>,
  removeComplementaryResourceFromLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationRemoveComplementaryResourceFromLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  removeConceptReferencesConcept?: Resolver<APIResolversTypes['UpdateConceptReferencesConceptResult'], ParentType, ContextType, RequireFields<APIMutationRemoveConceptReferencesConceptArgs, 'conceptId' | 'referencedConceptId'>>,
  removeLearningMaterialOutcome?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveLearningMaterialOutcomeArgs, 'learningMaterialId' | 'outcomeLearningGoalId'>>,
  removeLearningMaterialPrerequisite?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveLearningMaterialPrerequisiteArgs, 'learningMaterialId' | 'prerequisiteLearningGoalId'>>,
  removeTagsFromLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveTagsFromLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  resetPassword?: Resolver<APIResolversTypes['ResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationResetPasswordArgs, 'payload'>>,
  setConceptsKnown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsKnownArgs, 'payload'>>,
  setConceptsUnknown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsUnknownArgs, 'conceptIds'>>,
  setResourcesConsumed?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType, RequireFields<APIMutationSetResourcesConsumedArgs, 'payload'>>,
  startLearningGoal?: Resolver<APIResolversTypes['LearningGoalStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningGoalArgs, 'learningGoalId'>>,
  startLearningPath?: Resolver<APIResolversTypes['LearningPathStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningPathArgs, 'learningPathId'>>,
  triggerResetPassword?: Resolver<APIResolversTypes['TriggerResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationTriggerResetPasswordArgs, 'email'>>,
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>,
  updateConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptArgs, '_id' | 'payload'>>,
  updateConceptBelongsToDomain?: Resolver<APIResolversTypes['ConceptBelongsToDomain'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptBelongsToDomainArgs, 'conceptId' | 'domainId' | 'payload'>>,
  updateCurrentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationUpdateCurrentUserArgs, 'payload'>>,
  updateDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationUpdateDomainArgs, 'id' | 'payload'>>,
  updateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningGoalArgs, '_id' | 'payload'>>,
  updateLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningPathArgs, '_id' | 'payload'>>,
  updateResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationUpdateResourceArgs, '_id' | 'payload'>>,
  updateTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId' | 'payload'>>,
  verifyEmailAddress?: Resolver<APIResolversTypes['VerifyEmailResponse'], ParentType, ContextType, RequireFields<APIMutationVerifyEmailAddressArgs, 'token'>>,
  voteResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationVoteResourceArgs, 'resourceId' | 'value'>>,
}>;

export type APIConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Concept'] = APIResolversParentTypes['Concept']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  coveredByResources?: Resolver<Maybe<APIResolversTypes['ConceptCoveredByResourcesResults']>, ParentType, ContextType, RequireFields<APIConceptCoveredByResourcesArgs, 'options'>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domain?: Resolver<Maybe<APIResolversTypes['Domain']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  known?: Resolver<Maybe<APIResolversTypes['KnownConcept']>, ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  parentTopic?: Resolver<Maybe<APIResolversTypes['TopicIsSubTopicOfTopic']>, ParentType, ContextType>,
  referencedByConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptReferencesConceptItem']>>, ParentType, ContextType>,
  referencingConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptReferencesConceptItem']>>, ParentType, ContextType>,
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APIConceptSubTopicsArgs, 'options'>>,
  topicType?: Resolver<APIResolversTypes['TopicType'], ParentType, ContextType>,
  types?: Resolver<Array<APIResolversTypes['ConceptType']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIKnownConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['KnownConcept'] = APIResolversParentTypes['KnownConcept']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptReferencesConceptItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptReferencesConceptItem'] = APIResolversParentTypes['ConceptReferencesConceptItem']> = ResolversObject<{
  concept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  relationship?: Resolver<APIResolversTypes['ConceptReferencesConcept'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptCoveredByResourcesResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptCoveredByResourcesResults'] = APIResolversParentTypes['ConceptCoveredByResourcesResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIAddConceptToDomainResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AddConceptToDomainResult'] = APIResolversParentTypes['AddConceptToDomainResult']> = ResolversObject<{
  concept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  parentTopic?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteConceptResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteConceptResult'] = APIResolversParentTypes['DeleteConceptResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  domain?: Resolver<Maybe<APIResolversTypes['Domain']>, ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Domain'] = APIResolversParentTypes['Domain']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  conceptTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  concepts?: Resolver<Maybe<APIResolversTypes['DomainConceptsResults']>, ParentType, ContextType, RequireFields<APIDomainConceptsArgs, 'options'>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  learningGoals?: Resolver<Maybe<Array<APIResolversTypes['LearningGoalBelongsToDomain']>>, ParentType, ContextType>,
  learningMaterials?: Resolver<Maybe<APIResolversTypes['DomainLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APIDomainLearningMaterialsArgs, 'options'>>,
  learningMaterialsTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  learningPaths?: Resolver<Maybe<APIResolversTypes['DomainLearningPathsResults']>, ParentType, ContextType, RequireFields<APIDomainLearningPathsArgs, 'options'>>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  parentTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APIDomainParentTopicsArgs, 'options'>>,
  resources?: Resolver<Maybe<APIResolversTypes['DomainResourcesResults']>, ParentType, ContextType, RequireFields<APIDomainResourcesArgs, 'options'>>,
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APIDomainSubTopicsArgs, 'options'>>,
  topicType?: Resolver<APIResolversTypes['TopicType'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainLearningPathsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainLearningPathsResults'] = APIResolversParentTypes['DomainLearningPathsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['LearningPath']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainConceptsItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainConceptsItem'] = APIResolversParentTypes['DomainConceptsItem']> = ResolversObject<{
  concept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  relationship?: Resolver<APIResolversTypes['ConceptBelongsToDomain'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainConceptsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainConceptsResults'] = APIResolversParentTypes['DomainConceptsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['DomainConceptsItem']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainResourcesResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainResourcesResults'] = APIResolversParentTypes['DomainResourcesResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainLearningMaterialsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainLearningMaterialsResults'] = APIResolversParentTypes['DomainLearningMaterialsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['LearningMaterial']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchDomainsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchDomainsResult'] = APIResolversParentTypes['SearchDomainsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteDomainResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteDomainResponse'] = APIResolversParentTypes['DeleteDomainResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoal'] = APIResolversParentTypes['LearningGoal']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  dependantLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependantLearningGoalsArgs, never>>,
  dependsOnLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependsOnLearningGoalsArgs, never>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domain?: Resolver<Maybe<APIResolversTypes['LearningGoalBelongsToDomain']>, ParentType, ContextType>,
  hidden?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  parentTopic?: Resolver<Maybe<APIResolversTypes['TopicIsSubTopicOfTopic']>, ParentType, ContextType>,
  progress?: Resolver<Maybe<APIResolversTypes['LearningGoalProgress']>, ParentType, ContextType>,
  publishedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  relevantLearningMaterials?: Resolver<Maybe<APIResolversTypes['LearningGoalRelevantLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APILearningGoalRelevantLearningMaterialsArgs, 'options'>>,
  requiredInGoals?: Resolver<Maybe<Array<APIResolversTypes['RequiredInGoalItem']>>, ParentType, ContextType>,
  requiredSubGoals?: Resolver<Maybe<Array<APIResolversTypes['SubGoalItem']>>, ParentType, ContextType>,
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  started?: Resolver<Maybe<APIResolversTypes['LearningGoalStarted']>, ParentType, ContextType>,
  startedBy?: Resolver<Maybe<APIResolversTypes['LearningGoalStartedByResults']>, ParentType, ContextType, RequireFields<APILearningGoalStartedByArgs, 'options'>>,
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APILearningGoalSubTopicsArgs, 'options'>>,
  topicType?: Resolver<APIResolversTypes['TopicType'], ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['LearningGoalType'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDependsOnGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DependsOnGoalItem'] = APIResolversParentTypes['DependsOnGoalItem']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  parentLearningGoalId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalRelevantLearningMaterialsItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalRelevantLearningMaterialsItem'] = APIResolversParentTypes['LearningGoalRelevantLearningMaterialsItem']> = ResolversObject<{
  coverage?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalRelevantLearningMaterialsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalRelevantLearningMaterialsResults'] = APIResolversParentTypes['LearningGoalRelevantLearningMaterialsResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>,
  items?: Resolver<Array<APIResolversTypes['LearningGoalRelevantLearningMaterialsItem']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalProgressResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalProgress'] = APIResolversParentTypes['LearningGoalProgress']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalStartedResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStarted'] = APIResolversParentTypes['LearningGoalStarted']> = ResolversObject<{
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalStartedByResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedByResults'] = APIResolversParentTypes['LearningGoalStartedByResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>,
  items?: Resolver<Array<APIResolversTypes['LearningGoalStartedByItem']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalStartedByItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedByItem'] = APIResolversParentTypes['LearningGoalStartedByItem']> = ResolversObject<{
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  user?: Resolver<APIResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIRequiredInGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['RequiredInGoalItem'] = APIResolversParentTypes['RequiredInGoalItem']> = ResolversObject<{
  goal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISubGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubGoalItem'] = APIResolversParentTypes['SubGoalItem']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISubGoalResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubGoal'] = APIResolversParentTypes['SubGoal']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Concept' | 'LearningGoal', ParentType, ContextType>
}>;

export type APIDeleteLearningGoalMutationResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteLearningGoalMutationResult'] = APIResolversParentTypes['DeleteLearningGoalMutationResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainAndLearningGoalResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainAndLearningGoalResult'] = APIResolversParentTypes['DomainAndLearningGoalResult']> = ResolversObject<{
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchLearningGoalsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchLearningGoalsResult'] = APIResolversParentTypes['SearchLearningGoalsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['LearningGoal']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIAttachLearningGoalRequiresSubGoalResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AttachLearningGoalRequiresSubGoalResult'] = APIResolversParentTypes['AttachLearningGoalRequiresSubGoalResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDetachLearningGoalRequiresSubGoalResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachLearningGoalRequiresSubGoalResult'] = APIResolversParentTypes['DetachLearningGoalRequiresSubGoalResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalStartedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedResult'] = APIResolversParentTypes['LearningGoalStartedResult']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalPublishedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalPublishedResult'] = APIResolversParentTypes['LearningGoalPublishedResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalIndexedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalIndexedResult'] = APIResolversParentTypes['LearningGoalIndexedResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIUpdateLearningGoalDependenciesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UpdateLearningGoalDependenciesResult'] = APIResolversParentTypes['UpdateLearningGoalDependenciesResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  learningGoalDependency?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  parentLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterial'] = APIResolversParentTypes['LearningMaterial']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LearningPath' | 'Resource', ParentType, ContextType>,
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  coveredConcepts?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredConceptsResults']>, ParentType, ContextType, RequireFields<APILearningMaterialCoveredConceptsArgs, 'options'>>,
  coveredConceptsByDomain?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialCoveredConceptsByDomainItem']>>, ParentType, ContextType>,
  domains?: Resolver<Maybe<Array<APIResolversTypes['Domain']>>, ParentType, ContextType>,
  outcomes?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialOutcomeItem']>>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialPrerequisiteItem']>>, ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
}>;

export type APILearningMaterialCoveredConceptsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialCoveredConceptsResults'] = APIResolversParentTypes['LearningMaterialCoveredConceptsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialCoveredConceptsByDomainItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialCoveredConceptsByDomainItem'] = APIResolversParentTypes['LearningMaterialCoveredConceptsByDomainItem']> = ResolversObject<{
  coveredConcepts?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType>,
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialDomainsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialDomainsResults'] = APIResolversParentTypes['LearningMaterialDomainsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialPrerequisiteItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialPrerequisiteItem'] = APIResolversParentTypes['LearningMaterialPrerequisiteItem']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialOutcomeItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialOutcomeItem'] = APIResolversParentTypes['LearningMaterialOutcomeItem']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialTagResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialTag'] = APIResolversParentTypes['LearningMaterialTag']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialTagSearchResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialTagSearchResult'] = APIResolversParentTypes['LearningMaterialTagSearchResult']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  usageCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPath'] = APIResolversParentTypes['LearningPath']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  complementaryResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  coveredConcepts?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredConceptsResults']>, ParentType, ContextType, RequireFields<APILearningPathCoveredConceptsArgs, 'options'>>,
  coveredConceptsByDomain?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialCoveredConceptsByDomainItem']>>, ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domains?: Resolver<Maybe<Array<APIResolversTypes['Domain']>>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  outcomes?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialOutcomeItem']>>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialPrerequisiteItem']>>, ParentType, ContextType>,
  public?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  resourceItems?: Resolver<Maybe<Array<APIResolversTypes['LearningPathResourceItem']>>, ParentType, ContextType>,
  started?: Resolver<Maybe<APIResolversTypes['LearningPathStarted']>, ParentType, ContextType>,
  startedBy?: Resolver<Maybe<APIResolversTypes['LearningPathStartedByResults']>, ParentType, ContextType, RequireFields<APILearningPathStartedByArgs, 'options'>>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathStartedByResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedByResults'] = APIResolversParentTypes['LearningPathStartedByResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>,
  items?: Resolver<Array<APIResolversTypes['LearningPathStartedByItem']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathStartedByItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedByItem'] = APIResolversParentTypes['LearningPathStartedByItem']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  user?: Resolver<APIResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathResourceItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathResourceItem'] = APIResolversParentTypes['LearningPathResourceItem']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  learningPathId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathStartedResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStarted'] = APIResolversParentTypes['LearningPathStarted']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteLearningPathResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteLearningPathResult'] = APIResolversParentTypes['DeleteLearningPathResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIComplementaryResourceUpdatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ComplementaryResourceUpdatedResult'] = APIResolversParentTypes['ComplementaryResourceUpdatedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>,
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathStartedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedResult'] = APIResolversParentTypes['LearningPathStartedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>,
  user?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathCompletedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathCompletedResult'] = APIResolversParentTypes['LearningPathCompletedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>,
  user?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConsumedResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConsumedResource'] = APIResolversParentTypes['ConsumedResource']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  lastOpenedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  openedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Resource'] = APIResolversParentTypes['Resource']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  consumed?: Resolver<Maybe<APIResolversTypes['ConsumedResource']>, ParentType, ContextType>,
  coveredConcepts?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredConceptsResults']>, ParentType, ContextType, RequireFields<APIResourceCoveredConceptsArgs, 'options'>>,
  coveredConceptsByDomain?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialCoveredConceptsByDomainItem']>>, ParentType, ContextType>,
  creator?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domains?: Resolver<Maybe<Array<APIResolversTypes['Domain']>>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<APIResolversTypes['ResourceMediaType'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  nextResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  outcomes?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialOutcomeItem']>>, ParentType, ContextType>,
  parentResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialPrerequisiteItem']>>, ParentType, ContextType>,
  previousResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  seriesParentResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  subResourceSeries?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  subResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['ResourceType'], ParentType, ContextType>,
  upvotes?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceDomainsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceDomainsResults'] = APIResolversParentTypes['ResourceDomainsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceCoveredConceptsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceCoveredConceptsResults'] = APIResolversParentTypes['ResourceCoveredConceptsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceCoveredConceptsByDomainItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceCoveredConceptsByDomainItem'] = APIResolversParentTypes['ResourceCoveredConceptsByDomainItem']> = ResolversObject<{
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  coveredConcepts?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteResourceResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteResourceResponse'] = APIResolversParentTypes['DeleteResourceResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISubResourceCreatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceCreatedResult'] = APIResolversParentTypes['SubResourceCreatedResult']> = ResolversObject<{
  parentResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  subResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISubResourceSeriesCreatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceSeriesCreatedResult'] = APIResolversParentTypes['SubResourceSeriesCreatedResult']> = ResolversObject<{
  seriesParentResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  subResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchResourcesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResourcesResult'] = APIResolversParentTypes['SearchResourcesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISubResourceExtractedDataResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceExtractedData'] = APIResolversParentTypes['SubResourceExtractedData']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<APIResolversTypes['ResourceMediaType'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['ResourceType'], ParentType, ContextType>,
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceDataResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceData'] = APIResolversParentTypes['ResourceData']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<Maybe<APIResolversTypes['ResourceMediaType']>, ParentType, ContextType>,
  name?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  subResourceSeries?: Resolver<Maybe<Array<APIResolversTypes['SubResourceExtractedData']>>, ParentType, ContextType>,
  type?: Resolver<Maybe<APIResolversTypes['ResourceType']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIAnalyzeResourceUrlResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AnalyzeResourceUrlResult'] = APIResolversParentTypes['AnalyzeResourceUrlResult']> = ResolversObject<{
  resourceData?: Resolver<Maybe<APIResolversTypes['ResourceData']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIITopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ITopic'] = APIResolversParentTypes['ITopic']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Concept' | 'Domain' | 'LearningGoal', ParentType, ContextType>,
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APIITopicSubTopicsArgs, 'options'>>,
  topicType?: Resolver<APIResolversTypes['TopicType'], ParentType, ContextType>,
}>;

export type APISearchTopicsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchTopicsResult'] = APIResolversParentTypes['SearchTopicsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['ITopic']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APICheckTopicKeyAvailabilityResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CheckTopicKeyAvailabilityResult'] = APIResolversParentTypes['CheckTopicKeyAvailabilityResult']> = ResolversObject<{
  available?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  existingTopic?: Resolver<Maybe<APIResolversTypes['ITopic']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APIUserArticlesArgs, 'options'>>,
  bio?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  profilePictureUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APICurrentUserArticlesArgs, 'options'>>,
  bio?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  consumedResources?: Resolver<Maybe<APIResolversTypes['UserConsumedResourcesResult']>, ParentType, ContextType, RequireFields<APICurrentUserConsumedResourcesArgs, 'options'>>,
  createdLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['LearningGoalCreatedItem']>>, ParentType, ContextType, RequireFields<APICurrentUserCreatedLearningGoalsArgs, 'options'>>,
  createdLearningPaths?: Resolver<Maybe<Array<APIResolversTypes['LearningPath']>>, ParentType, ContextType, RequireFields<APICurrentUserCreatedLearningPathsArgs, 'options'>>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  profilePictureUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
  startedLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['LearningGoalStartedItem']>>, ParentType, ContextType, RequireFields<APICurrentUserStartedLearningGoalsArgs, 'options'>>,
  startedLearningPaths?: Resolver<Maybe<Array<APIResolversTypes['LearningPathStartedItem']>>, ParentType, ContextType, RequireFields<APICurrentUserStartedLearningPathsArgs, 'options'>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIUserConsumedResourcesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UserConsumedResourcesResult'] = APIResolversParentTypes['UserConsumedResourcesResult']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>,
  items?: Resolver<Array<APIResolversTypes['UserConsumedResourceItem']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIUserConsumedResourceItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UserConsumedResourceItem'] = APIResolversParentTypes['UserConsumedResourceItem']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  lastOpenedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  openedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalCreatedItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalCreatedItem'] = APIResolversParentTypes['LearningGoalCreatedItem']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalStartedItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedItem'] = APIResolversParentTypes['LearningGoalStartedItem']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathStartedItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedItem'] = APIResolversParentTypes['LearningPathStartedItem']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>,
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILoginResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LoginResponse'] = APIResolversParentTypes['LoginResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  jwt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  redirectUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIVerifyEmailResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['VerifyEmailResponse'] = APIResolversParentTypes['VerifyEmailResponse']> = ResolversObject<{
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITriggerResetPasswordResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TriggerResetPasswordResponse'] = APIResolversParentTypes['TriggerResetPasswordResponse']> = ResolversObject<{
  errorMessage?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResetPasswordResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResetPasswordResponse'] = APIResolversParentTypes['ResetPasswordResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIGetHomePageDataResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetHomePageDataResults'] = APIResolversParentTypes['GetHomePageDataResults']> = ResolversObject<{
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>,
  recommendedLearningGoals?: Resolver<Array<APIResolversTypes['LearningGoal']>, ParentType, ContextType>,
  recommendedLearningPaths?: Resolver<Array<APIResolversTypes['LearningPath']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchResultEntityResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResultEntity'] = APIResolversParentTypes['SearchResultEntity']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Concept' | 'Domain' | 'LearningGoal' | 'LearningPath' | 'Resource', ParentType, ContextType>
}>;

export type APISearchResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResult'] = APIResolversParentTypes['SearchResult']> = ResolversObject<{
  entity?: Resolver<APIResolversTypes['SearchResultEntity'], ParentType, ContextType>,
  score?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIGlobalSearchResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GlobalSearchResults'] = APIResolversParentTypes['GlobalSearchResults']> = ResolversObject<{
  results?: Resolver<Array<APIResolversTypes['SearchResult']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIGetTopLevelDomainsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopLevelDomainsResults'] = APIResolversParentTypes['GetTopLevelDomainsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface APIDateScalarConfig extends GraphQLScalarTypeConfig<APIResolversTypes['Date'], any> {
  name: 'Date'
}

export type APIUpdateConceptReferencesConceptResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UpdateConceptReferencesConceptResult'] = APIResolversParentTypes['UpdateConceptReferencesConceptResult']> = ResolversObject<{
  concept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  referencedConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITopicIsSubTopicOfTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicIsSubTopicOfTopic'] = APIResolversParentTypes['TopicIsSubTopicOfTopic']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdByUserId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  subTopic?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType>,
  parentTopic?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult'] = APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult']> = ResolversObject<{
  parentTopic?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType>,
  subTopic?: Resolver<APIResolversTypes['ITopic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptBelongsToDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptBelongsToDomain'] = APIResolversParentTypes['ConceptBelongsToDomain']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningGoalBelongsToDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalBelongsToDomain'] = APIResolversParentTypes['LearningGoalBelongsToDomain']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptReferencesConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptReferencesConcept'] = APIResolversParentTypes['ConceptReferencesConcept']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  Article?: APIArticleResolvers<ContextType>,
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>,
  Query?: APIQueryResolvers<ContextType>,
  DeleteArticleResponse?: APIDeleteArticleResponseResolvers<ContextType>,
  Mutation?: APIMutationResolvers<ContextType>,
  Concept?: APIConceptResolvers<ContextType>,
  KnownConcept?: APIKnownConceptResolvers<ContextType>,
  ConceptReferencesConceptItem?: APIConceptReferencesConceptItemResolvers<ContextType>,
  ConceptCoveredByResourcesResults?: APIConceptCoveredByResourcesResultsResolvers<ContextType>,
  AddConceptToDomainResult?: APIAddConceptToDomainResultResolvers<ContextType>,
  DeleteConceptResult?: APIDeleteConceptResultResolvers<ContextType>,
  Domain?: APIDomainResolvers<ContextType>,
  DomainLearningPathsResults?: APIDomainLearningPathsResultsResolvers<ContextType>,
  DomainConceptsItem?: APIDomainConceptsItemResolvers<ContextType>,
  DomainConceptsResults?: APIDomainConceptsResultsResolvers<ContextType>,
  DomainResourcesResults?: APIDomainResourcesResultsResolvers<ContextType>,
  DomainLearningMaterialsResults?: APIDomainLearningMaterialsResultsResolvers<ContextType>,
  SearchDomainsResult?: APISearchDomainsResultResolvers<ContextType>,
  DeleteDomainResponse?: APIDeleteDomainResponseResolvers<ContextType>,
  LearningGoal?: APILearningGoalResolvers<ContextType>,
  DependsOnGoalItem?: APIDependsOnGoalItemResolvers<ContextType>,
  LearningGoalRelevantLearningMaterialsItem?: APILearningGoalRelevantLearningMaterialsItemResolvers<ContextType>,
  LearningGoalRelevantLearningMaterialsResults?: APILearningGoalRelevantLearningMaterialsResultsResolvers<ContextType>,
  LearningGoalProgress?: APILearningGoalProgressResolvers<ContextType>,
  LearningGoalStarted?: APILearningGoalStartedResolvers<ContextType>,
  LearningGoalStartedByResults?: APILearningGoalStartedByResultsResolvers<ContextType>,
  LearningGoalStartedByItem?: APILearningGoalStartedByItemResolvers<ContextType>,
  RequiredInGoalItem?: APIRequiredInGoalItemResolvers<ContextType>,
  SubGoalItem?: APISubGoalItemResolvers<ContextType>,
  SubGoal?: APISubGoalResolvers,
  DeleteLearningGoalMutationResult?: APIDeleteLearningGoalMutationResultResolvers<ContextType>,
  DomainAndLearningGoalResult?: APIDomainAndLearningGoalResultResolvers<ContextType>,
  SearchLearningGoalsResult?: APISearchLearningGoalsResultResolvers<ContextType>,
  AttachLearningGoalRequiresSubGoalResult?: APIAttachLearningGoalRequiresSubGoalResultResolvers<ContextType>,
  DetachLearningGoalRequiresSubGoalResult?: APIDetachLearningGoalRequiresSubGoalResultResolvers<ContextType>,
  LearningGoalStartedResult?: APILearningGoalStartedResultResolvers<ContextType>,
  LearningGoalPublishedResult?: APILearningGoalPublishedResultResolvers<ContextType>,
  LearningGoalIndexedResult?: APILearningGoalIndexedResultResolvers<ContextType>,
  UpdateLearningGoalDependenciesResult?: APIUpdateLearningGoalDependenciesResultResolvers<ContextType>,
  LearningMaterial?: APILearningMaterialResolvers,
  LearningMaterialCoveredConceptsResults?: APILearningMaterialCoveredConceptsResultsResolvers<ContextType>,
  LearningMaterialCoveredConceptsByDomainItem?: APILearningMaterialCoveredConceptsByDomainItemResolvers<ContextType>,
  LearningMaterialDomainsResults?: APILearningMaterialDomainsResultsResolvers<ContextType>,
  LearningMaterialPrerequisiteItem?: APILearningMaterialPrerequisiteItemResolvers<ContextType>,
  LearningMaterialOutcomeItem?: APILearningMaterialOutcomeItemResolvers<ContextType>,
  LearningMaterialTag?: APILearningMaterialTagResolvers<ContextType>,
  LearningMaterialTagSearchResult?: APILearningMaterialTagSearchResultResolvers<ContextType>,
  LearningPath?: APILearningPathResolvers<ContextType>,
  LearningPathStartedByResults?: APILearningPathStartedByResultsResolvers<ContextType>,
  LearningPathStartedByItem?: APILearningPathStartedByItemResolvers<ContextType>,
  LearningPathResourceItem?: APILearningPathResourceItemResolvers<ContextType>,
  LearningPathStarted?: APILearningPathStartedResolvers<ContextType>,
  DeleteLearningPathResult?: APIDeleteLearningPathResultResolvers<ContextType>,
  ComplementaryResourceUpdatedResult?: APIComplementaryResourceUpdatedResultResolvers<ContextType>,
  LearningPathStartedResult?: APILearningPathStartedResultResolvers<ContextType>,
  LearningPathCompletedResult?: APILearningPathCompletedResultResolvers<ContextType>,
  ConsumedResource?: APIConsumedResourceResolvers<ContextType>,
  Resource?: APIResourceResolvers<ContextType>,
  ResourceDomainsResults?: APIResourceDomainsResultsResolvers<ContextType>,
  ResourceCoveredConceptsResults?: APIResourceCoveredConceptsResultsResolvers<ContextType>,
  ResourceCoveredConceptsByDomainItem?: APIResourceCoveredConceptsByDomainItemResolvers<ContextType>,
  DeleteResourceResponse?: APIDeleteResourceResponseResolvers<ContextType>,
  SubResourceCreatedResult?: APISubResourceCreatedResultResolvers<ContextType>,
  SubResourceSeriesCreatedResult?: APISubResourceSeriesCreatedResultResolvers<ContextType>,
  SearchResourcesResult?: APISearchResourcesResultResolvers<ContextType>,
  SubResourceExtractedData?: APISubResourceExtractedDataResolvers<ContextType>,
  ResourceData?: APIResourceDataResolvers<ContextType>,
  AnalyzeResourceUrlResult?: APIAnalyzeResourceUrlResultResolvers<ContextType>,
  ITopic?: APIITopicResolvers,
  SearchTopicsResult?: APISearchTopicsResultResolvers<ContextType>,
  CheckTopicKeyAvailabilityResult?: APICheckTopicKeyAvailabilityResultResolvers<ContextType>,
  User?: APIUserResolvers<ContextType>,
  CurrentUser?: APICurrentUserResolvers<ContextType>,
  UserConsumedResourcesResult?: APIUserConsumedResourcesResultResolvers<ContextType>,
  UserConsumedResourceItem?: APIUserConsumedResourceItemResolvers<ContextType>,
  LearningGoalCreatedItem?: APILearningGoalCreatedItemResolvers<ContextType>,
  LearningGoalStartedItem?: APILearningGoalStartedItemResolvers<ContextType>,
  LearningPathStartedItem?: APILearningPathStartedItemResolvers<ContextType>,
  LoginResponse?: APILoginResponseResolvers<ContextType>,
  VerifyEmailResponse?: APIVerifyEmailResponseResolvers<ContextType>,
  TriggerResetPasswordResponse?: APITriggerResetPasswordResponseResolvers<ContextType>,
  ResetPasswordResponse?: APIResetPasswordResponseResolvers<ContextType>,
  GetHomePageDataResults?: APIGetHomePageDataResultsResolvers<ContextType>,
  SearchResultEntity?: APISearchResultEntityResolvers,
  SearchResult?: APISearchResultResolvers<ContextType>,
  GlobalSearchResults?: APIGlobalSearchResultsResolvers<ContextType>,
  GetTopLevelDomainsResults?: APIGetTopLevelDomainsResultsResolvers<ContextType>,
  Date?: GraphQLScalarType,
  UpdateConceptReferencesConceptResult?: APIUpdateConceptReferencesConceptResultResolvers<ContextType>,
  TopicIsSubTopicOfTopic?: APITopicIsSubTopicOfTopicResolvers<ContextType>,
  DetachTopicIsSubTopicOfTopicResult?: APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType>,
  ConceptBelongsToDomain?: APIConceptBelongsToDomainResolvers<ContextType>,
  LearningGoalBelongsToDomain?: APILearningGoalBelongsToDomainResolvers<ContextType>,
  ConceptReferencesConcept?: APIConceptReferencesConceptResolvers<ContextType>,
}>;


