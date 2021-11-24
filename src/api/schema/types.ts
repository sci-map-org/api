import { ArticleContentType } from '../../entities/Article';
import { UserRole } from '../../entities/User';
import { ResourceType } from '../../entities/Resource';
import { ResourceMediaType } from '../../entities/Resource';
import { SortingDirection } from '../../repositories/util/sorting';
import { LearningGoalType } from '../../entities/LearningGoal';
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
  getHomePageData: APIGetHomePageDataResults;
  getLearningGoalByKey: APILearningGoal;
  getLearningPathById: APILearningPath;
  getLearningPathByKey: APILearningPath;
  getResourceById: APIResource;
  getResourceByKey: APIResource;
  getTopLevelTopics: APIGetTopLevelTopicsResults;
  getTopicById: APITopic;
  getTopicByKey: APITopic;
  getUser: APIUser;
  globalSearch: APIGlobalSearchResults;
  listArticles: APIListArticlesResult;
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
  key: Scalars['String'];
};


export type APIQueryGetArticleByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetLearningGoalByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetLearningPathByIdArgs = {
  learningPathId: Scalars['String'];
};


export type APIQueryGetLearningPathByKeyArgs = {
  learningPathKey: Scalars['String'];
};


export type APIQueryGetResourceByIdArgs = {
  resourceId: Scalars['String'];
};


export type APIQueryGetResourceByKeyArgs = {
  resourceKey: Scalars['String'];
};


export type APIQueryGetTopicByIdArgs = {
  topicId: Scalars['String'];
};


export type APIQueryGetTopicByKeyArgs = {
  topicKey: Scalars['String'];
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
  options: APISearchTopicsOptions;
  topicId: Scalars['String'];
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
  addLearningMaterialHasPrerequisiteTopic: APILearningMaterial;
  addSubResource: APISubResourceCreatedResult;
  addSubResourceToSeries: APISubResourceSeriesCreatedResult;
  addSubTopic: APITopic;
  addTagsToLearningMaterial: APILearningMaterial;
  addTopicHasPrerequisiteTopic: APIAddTopicHasPrerequisiteTopicResult;
  adminUpdateUser: APIUser;
  attachLearningGoalDependency: APIUpdateLearningGoalDependenciesResult;
  attachLearningGoalRequiresSubGoal: APIAttachLearningGoalRequiresSubGoalResult;
  attachLearningMaterialCoversTopics: APILearningMaterial;
  attachTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  completeLearningPath: APILearningPathCompletedResult;
  createArticle: APIArticle;
  createLearningGoal: APILearningGoal;
  createLearningPath: APILearningPath;
  createResource: APIResource;
  createSubResourceSeries: APISubResourceSeriesCreatedResult;
  createTopic: APITopic;
  deleteArticle: APIDeleteArticleResponse;
  deleteLearningGoal: APIDeleteLearningGoalMutationResult;
  deleteLearningPath: APIDeleteLearningPathResult;
  deleteResource: APIDeleteResourceResponse;
  deleteTopic: APIDeleteTopicResponse;
  detachLearningGoalDependency: APIUpdateLearningGoalDependenciesResult;
  detachLearningGoalRequiresSubGoal: APIDetachLearningGoalRequiresSubGoalResult;
  detachLearningMaterialCoversTopics: APILearningMaterial;
  detachTopicIsSubTopicOfTopic: APIDetachTopicIsSubTopicOfTopicResult;
  hideLearningMaterialFromTopic: APILearningMaterial;
  indexLearningGoal: APILearningGoalIndexedResult;
  login: APILoginResponse;
  loginGoogle: APILoginResponse;
  publishLearningGoal: APILearningGoalPublishedResult;
  rateLearningGoal: APILearningGoal;
  rateLearningMaterial: APILearningMaterial;
  recommendLearningMaterial: APILearningMaterial;
  register: APICurrentUser;
  registerGoogle: APICurrentUser;
  removeComplementaryResourceFromLearningPath: APIComplementaryResourceUpdatedResult;
  removeLearningMaterialHasPrerequisiteTopic: APILearningMaterial;
  removeTagsFromLearningMaterial: APILearningMaterial;
  removeTopicHasPrerequisiteTopic: APIRemoveTopicHasPrerequisiteTopicResult;
  resetPassword: APIResetPasswordResponse;
  setResourcesConsumed: Array<APIResource>;
  setTopicsKnown: Array<APITopic>;
  setTopicsUnknown: Array<APITopic>;
  showLearningMaterialInTopic: APILearningMaterial;
  startLearningGoal: APILearningGoalStartedResult;
  startLearningPath: APILearningPathStartedResult;
  triggerResetPassword: APITriggerResetPasswordResponse;
  updateArticle: APIArticle;
  updateCurrentUser: APICurrentUser;
  /**
   * attachLearningGoalToDomain(
   *   learningGoalId: String!
   *   domainId: String!
   *   payload: AttachLearningGoalToDomainPayload!
   * ): DomainAndLearningGoalResult! TODO
   * detachLearningGoalFromDomain(learningGoalId: String!, domainId: String!): DomainAndLearningGoalResult!
   */
  updateLearningGoal: APILearningGoal;
  updateLearningPath: APILearningPath;
  updateResource: APIResource;
  updateTopic: APITopic;
  updateTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  verifyEmailAddress: APIVerifyEmailResponse;
};


export type APIMutationAddComplementaryResourceToLearningPathArgs = {
  learningPathId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationAddLearningMaterialHasPrerequisiteTopicArgs = {
  learningMaterialId: Scalars['String'];
  prerequisiteTopicId: Scalars['String'];
  strength?: Maybe<Scalars['Float']>;
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


export type APIMutationAddSubTopicArgs = {
  parentTopicId: Scalars['String'];
  payload: APICreateTopicPayload;
};


export type APIMutationAddTagsToLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationAddTopicHasPrerequisiteTopicArgs = {
  topicId: Scalars['String'];
  prerequisiteTopicId: Scalars['String'];
  strength?: Maybe<Scalars['Float']>;
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


export type APIMutationAttachLearningMaterialCoversTopicsArgs = {
  learningMaterialId: Scalars['String'];
  topicsIds: Array<Scalars['String']>;
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


export type APIMutationCreateTopicArgs = {
  payload: APICreateTopicPayload;
};


export type APIMutationDeleteArticleArgs = {
  id: Scalars['String'];
};


export type APIMutationDeleteLearningGoalArgs = {
  _id: Scalars['String'];
};


export type APIMutationDeleteLearningPathArgs = {
  learningPathId: Scalars['String'];
};


export type APIMutationDeleteResourceArgs = {
  resourceId: Scalars['String'];
};


export type APIMutationDeleteTopicArgs = {
  topicId: Scalars['String'];
};


export type APIMutationDetachLearningGoalDependencyArgs = {
  learningGoalDependencyId: Scalars['String'];
  learningGoalId: Scalars['String'];
  parentLearningGoalId: Scalars['String'];
};


export type APIMutationDetachLearningGoalRequiresSubGoalArgs = {
  learningGoalId: Scalars['String'];
  subGoalId: Scalars['String'];
};


export type APIMutationDetachLearningMaterialCoversTopicsArgs = {
  learningMaterialId: Scalars['String'];
  topicsIds: Array<Scalars['String']>;
};


export type APIMutationDetachTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
};


export type APIMutationHideLearningMaterialFromTopicArgs = {
  learningMaterialId: Scalars['String'];
  topicId: Scalars['String'];
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


export type APIMutationRecommendLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
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


export type APIMutationRemoveLearningMaterialHasPrerequisiteTopicArgs = {
  learningMaterialId: Scalars['String'];
  prerequisiteTopicId: Scalars['String'];
};


export type APIMutationRemoveTagsFromLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationRemoveTopicHasPrerequisiteTopicArgs = {
  topicId: Scalars['String'];
  prerequisiteTopicId: Scalars['String'];
};


export type APIMutationResetPasswordArgs = {
  payload: APIResetPasswordPayload;
};


export type APIMutationSetResourcesConsumedArgs = {
  payload: APISetResourcesConsumedPayload;
};


export type APIMutationSetTopicsKnownArgs = {
  payload: APISetTopicsKnownPayload;
};


export type APIMutationSetTopicsUnknownArgs = {
  topicIds: Array<Scalars['String']>;
};


export type APIMutationShowLearningMaterialInTopicArgs = {
  learningMaterialId: Scalars['String'];
  topicId: Scalars['String'];
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


export type APIMutationUpdateCurrentUserArgs = {
  payload: APIUpdateCurrentUserPayload;
};


export type APIMutationUpdateLearningGoalArgs = {
  _id: Scalars['String'];
  payload: APIUpdateLearningGoalPayload;
};


export type APIMutationUpdateLearningPathArgs = {
  learningPathId: Scalars['String'];
  payload: APIUpdateLearningPathPayload;
};


export type APIMutationUpdateResourceArgs = {
  payload: APIUpdateResourcePayload;
  resourceId: Scalars['String'];
};


export type APIMutationUpdateTopicArgs = {
  topicId: Scalars['String'];
  payload: APIUpdateTopicPayload;
};


export type APIMutationUpdateTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
  payload: APIUpdateTopicIsSubTopicOfTopicPayload;
};


export type APIMutationVerifyEmailAddressArgs = {
  token: Scalars['String'];
};

export { LearningGoalType };

export type APILearningGoal = {
   __typename?: 'LearningGoal';
  _id: Scalars['String'];
  createdBy?: Maybe<APIUser>;
  dependantLearningGoals?: Maybe<Array<APIDependsOnGoalItem>>;
  dependsOnLearningGoals?: Maybe<Array<APIDependsOnGoalItem>>;
  description?: Maybe<Scalars['String']>;
  hidden: Scalars['Boolean'];
  key: Scalars['String'];
  name: Scalars['String'];
  progress?: Maybe<APILearningGoalProgress>;
  publishedAt?: Maybe<Scalars['Date']>;
  rating?: Maybe<Scalars['Float']>;
  relevantLearningMaterials?: Maybe<APILearningGoalRelevantLearningMaterialsResults>;
  requiredInGoals?: Maybe<Array<APIRequiredInGoalItem>>;
  requiredSubGoals?: Maybe<Array<APISubGoalItem>>;
  showedIn?: Maybe<Array<APITopic>>;
  size?: Maybe<Scalars['Float']>;
  started?: Maybe<APILearningGoalStarted>;
  startedBy?: Maybe<APILearningGoalStartedByResults>;
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

export type APISubGoal = APILearningGoal | APITopic;

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
  /** rating: Float */
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  /** outcomes: [LearningMaterialOutcomeItem!] */
  createdBy?: Maybe<APIUser>;
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  showedIn?: Maybe<Array<APITopic>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningMaterialCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
};

export enum APILearningMaterialType {
  Resource = 'Resource',
  LearningPath = 'LearningPath'
}

export type APILearningMaterialCoveredSubTopicsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APILearningMaterialCoveredSubTopicsResults = {
   __typename?: 'LearningMaterialCoveredSubTopicsResults';
  items: Array<APITopic>;
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
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  key: Scalars['String'];
  name: Scalars['String'];
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  public: Scalars['Boolean'];
  resourceItems?: Maybe<Array<APILearningPathResourceItem>>;
  showedIn?: Maybe<Array<APITopic>>;
  /** rating: Float */
  started?: Maybe<APILearningPathStarted>;
  startedBy?: Maybe<APILearningPathStartedByResults>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningPathCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
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
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  /** rating: Float */
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  nextResource?: Maybe<APIResource>;
  parentResources?: Maybe<Array<APIResource>>;
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  previousResource?: Maybe<APIResource>;
  seriesParentResource?: Maybe<APIResource>;
  showedIn?: Maybe<Array<APITopic>>;
  subResourceSeries?: Maybe<Array<APIResource>>;
  subResources?: Maybe<Array<APIResource>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
  type: ResourceType;
  upvotes?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};


export type APIResourceCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
};

export type APICreateSubResourcePayload = {
  coveredSubTopicsIds?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  outcomesSubGoalsIds?: Maybe<Array<Scalars['String']>>;
  /** covered subtopics TODO */
  prerequisitesSubGoalsIds?: Maybe<Array<Scalars['String']>>;
  showInTopicsIds: Array<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  type: ResourceType;
  url: Scalars['String'];
};

export type APICreateResourcePayload = {
  coveredSubTopicsIds?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  outcomesSubGoalsIds?: Maybe<Array<Scalars['String']>>;
  /** covered subtopics TODO */
  prerequisitesSubGoalsIds?: Maybe<Array<Scalars['String']>>;
  showInTopicsIds: Array<Scalars['String']>;
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

export type APITopic = {
   __typename?: 'Topic';
  _id: Scalars['String'];
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  followUps?: Maybe<Array<APITopicHasPrerequisiteTopicItem>>;
  key: Scalars['String'];
  learningMaterials?: Maybe<APITopicLearningMaterialsResults>;
  learningMaterialsTotalCount?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  parentTopic?: Maybe<APITopic>;
  /**
   * learningGoals: [LearningGoalBelongsToDomain!] => TODO
   * progress | completion
   * known: KnownTopic TODO -> change schema, both progress and wether marked as known or not
   */
  prerequisites?: Maybe<Array<APITopicHasPrerequisiteTopicItem>>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  subTopicsTotalCount?: Maybe<Scalars['Int']>;
};


export type APITopicLearningMaterialsArgs = {
  options: APITopicLearningMaterialsOptions;
};


export type APITopicSubTopicsArgs = {
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
};

export type APISearchTopicsOptions = {
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APISearchTopicsResult = {
   __typename?: 'SearchTopicsResult';
  items: Array<APITopic>;
};

/** learning materials */
export enum APITopicLearningMaterialsSortingType {
  Newest = 'newest',
  Rating = 'rating',
  Recommended = 'recommended'
}

export type APITopicLearningMaterialsFilterOptions = {
  /** resourceTypeIn: [ResourceType!] */
  completedByUser: Scalars['Boolean'];
};

export type APITopicLearningMaterialsOptions = {
  filter: APITopicLearningMaterialsFilterOptions;
  query?: Maybe<Scalars['String']>;
  sortingType: APITopicLearningMaterialsSortingType;
};

export type APITopicLearningMaterialsResults = {
   __typename?: 'TopicLearningMaterialsResults';
  items: Array<APILearningMaterial>;
};

/** prereq */
export type APITopicHasPrerequisiteTopicItem = {
   __typename?: 'TopicHasPrerequisiteTopicItem';
  relationship: APITopicHasPrerequisiteTopic;
  topic: APITopic;
};

export type APICheckTopicKeyAvailabilityResult = {
   __typename?: 'CheckTopicKeyAvailabilityResult';
  available: Scalars['Boolean'];
  existingTopic?: Maybe<APITopic>;
};

/** progress */
export type APIKnownTopic = {
   __typename?: 'KnownTopic';
  level: Scalars['Float'];
};

export type APICreateTopicPayload = {
  name: Scalars['String'];
  key: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type APIUpdateTopicPayload = {
  name?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type APIDeleteTopicResponse = {
   __typename?: 'DeleteTopicResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APISetTopicKnownPayloadTopicsField = {
  topicId: Scalars['String'];
  level?: Maybe<Scalars['Float']>;
};

export type APISetTopicsKnownPayload = {
  topics: Array<APISetTopicKnownPayloadTopicsField>;
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

export type APISearchResultEntity = APILearningGoal | APILearningPath | APIResource | APITopic;

export type APISearchResult = {
   __typename?: 'SearchResult';
  entity: APISearchResultEntity;
  score: Scalars['Float'];
};

export type APIGlobalSearchResults = {
   __typename?: 'GlobalSearchResults';
  results: Array<APISearchResult>;
};

export type APIGetTopLevelTopicsResults = {
   __typename?: 'GetTopLevelTopicsResults';
  items: Array<APITopic>;
};


export type APIAddTopicHasPrerequisiteTopicResult = {
   __typename?: 'AddTopicHasPrerequisiteTopicResult';
  topic: APITopic;
  strength: Scalars['Float'];
  prerequisiteTopic: APITopic;
};

export type APITopicIsSubTopicOfTopic = {
   __typename?: 'TopicIsSubTopicOfTopic';
  index: Scalars['Float'];
  createdAt: Scalars['Date'];
  createdByUserId?: Maybe<Scalars['String']>;
  subTopic: APITopic;
  parentTopic: APITopic;
};

export type APIAttachTopicIsSubTopicOfTopicPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIDetachTopicIsSubTopicOfTopicResult = {
   __typename?: 'DetachTopicIsSubTopicOfTopicResult';
  parentTopic: APITopic;
  subTopic: APITopic;
};

export type APIRemoveTopicHasPrerequisiteTopicResult = {
   __typename?: 'RemoveTopicHasPrerequisiteTopicResult';
  topic: APITopic;
  prerequisiteTopic: APITopic;
};

export type APIUpdateTopicIsSubTopicOfTopicPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APILearningMaterialHasPrerequisiteTopic = {
   __typename?: 'LearningMaterialHasPrerequisiteTopic';
  strength: Scalars['Float'];
  createdByUserId: Scalars['String'];
  createdAt: Scalars['Date'];
  topic: APITopic;
  learningMaterial: APILearningMaterial;
};

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type APITopicHasPrerequisiteTopic = {
   __typename?: 'TopicHasPrerequisiteTopic';
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
  LearningGoalType: LearningGoalType,
  LearningGoal: ResolverTypeWrapper<APILearningGoal>,
  DependsOnGoalItem: ResolverTypeWrapper<APIDependsOnGoalItem>,
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions,
  LearningGoalRelevantLearningMaterialsItem: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsItem>,
  LearningGoalRelevantLearningMaterialsResults: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsResults>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  LearningGoalProgress: ResolverTypeWrapper<APILearningGoalProgress>,
  LearningGoalStarted: ResolverTypeWrapper<APILearningGoalStarted>,
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions,
  LearningGoalStartedByResults: ResolverTypeWrapper<APILearningGoalStartedByResults>,
  LearningGoalStartedByItem: ResolverTypeWrapper<APILearningGoalStartedByItem>,
  RequiredInGoalItem: ResolverTypeWrapper<APIRequiredInGoalItem>,
  SubGoalItem: ResolverTypeWrapper<Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>,
  SubGoal: APIResolversTypes['LearningGoal'] | APIResolversTypes['Topic'],
  CreateLearningGoalPayload: APICreateLearningGoalPayload,
  CreateLearningGoalOptions: APICreateLearningGoalOptions,
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload,
  AttachLearningGoalToDomainPayload: APIAttachLearningGoalToDomainPayload,
  DeleteLearningGoalMutationResult: ResolverTypeWrapper<APIDeleteLearningGoalMutationResult>,
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
  LearningMaterialCoveredSubTopicsOptions: APILearningMaterialCoveredSubTopicsOptions,
  LearningMaterialCoveredSubTopicsResults: ResolverTypeWrapper<APILearningMaterialCoveredSubTopicsResults>,
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
  CreateSubResourcePayload: APICreateSubResourcePayload,
  CreateResourcePayload: APICreateResourcePayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  DeleteResourceResponse: ResolverTypeWrapper<APIDeleteResourceResponse>,
  SubResourceCreatedResult: ResolverTypeWrapper<APISubResourceCreatedResult>,
  SubResourceSeriesCreatedResult: ResolverTypeWrapper<APISubResourceSeriesCreatedResult>,
  SearchResourcesOptions: APISearchResourcesOptions,
  SearchResourcesResult: ResolverTypeWrapper<APISearchResourcesResult>,
  SubResourceExtractedData: ResolverTypeWrapper<APISubResourceExtractedData>,
  ResourceData: ResolverTypeWrapper<APIResourceData>,
  AnalyzeResourceUrlResult: ResolverTypeWrapper<APIAnalyzeResourceUrlResult>,
  Topic: ResolverTypeWrapper<APITopic>,
  TopicSubTopicsSortingType: APITopicSubTopicsSortingType,
  TopicSubTopicsSortingOptions: APITopicSubTopicsSortingOptions,
  TopicSubTopicsOptions: APITopicSubTopicsOptions,
  SearchTopicsOptions: APISearchTopicsOptions,
  SearchTopicsResult: ResolverTypeWrapper<APISearchTopicsResult>,
  TopicLearningMaterialsSortingType: APITopicLearningMaterialsSortingType,
  TopicLearningMaterialsFilterOptions: APITopicLearningMaterialsFilterOptions,
  TopicLearningMaterialsOptions: APITopicLearningMaterialsOptions,
  TopicLearningMaterialsResults: ResolverTypeWrapper<APITopicLearningMaterialsResults>,
  TopicHasPrerequisiteTopicItem: ResolverTypeWrapper<APITopicHasPrerequisiteTopicItem>,
  CheckTopicKeyAvailabilityResult: ResolverTypeWrapper<APICheckTopicKeyAvailabilityResult>,
  KnownTopic: ResolverTypeWrapper<APIKnownTopic>,
  CreateTopicPayload: APICreateTopicPayload,
  UpdateTopicPayload: APIUpdateTopicPayload,
  DeleteTopicResponse: ResolverTypeWrapper<APIDeleteTopicResponse>,
  SetTopicKnownPayloadTopicsField: APISetTopicKnownPayloadTopicsField,
  SetTopicsKnownPayload: APISetTopicsKnownPayload,
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
  SearchResultEntity: APIResolversTypes['LearningGoal'] | APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'] | APIResolversTypes['Topic'],
  SearchResult: ResolverTypeWrapper<Omit<APISearchResult, 'entity'> & { entity: APIResolversTypes['SearchResultEntity'] }>,
  GlobalSearchResults: ResolverTypeWrapper<APIGlobalSearchResults>,
  GetTopLevelTopicsResults: ResolverTypeWrapper<APIGetTopLevelTopicsResults>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  AddTopicHasPrerequisiteTopicResult: ResolverTypeWrapper<APIAddTopicHasPrerequisiteTopicResult>,
  TopicIsSubTopicOfTopic: ResolverTypeWrapper<APITopicIsSubTopicOfTopic>,
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload,
  DetachTopicIsSubTopicOfTopicResult: ResolverTypeWrapper<APIDetachTopicIsSubTopicOfTopicResult>,
  RemoveTopicHasPrerequisiteTopicResult: ResolverTypeWrapper<APIRemoveTopicHasPrerequisiteTopicResult>,
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload,
  LearningMaterialHasPrerequisiteTopic: ResolverTypeWrapper<APILearningMaterialHasPrerequisiteTopic>,
  PaginationOptions: APIPaginationOptions,
  TopicHasPrerequisiteTopic: ResolverTypeWrapper<APITopicHasPrerequisiteTopic>,
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
  LearningGoalType: LearningGoalType,
  LearningGoal: APILearningGoal,
  DependsOnGoalItem: APIDependsOnGoalItem,
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions,
  LearningGoalRelevantLearningMaterialsItem: APILearningGoalRelevantLearningMaterialsItem,
  LearningGoalRelevantLearningMaterialsResults: APILearningGoalRelevantLearningMaterialsResults,
  Int: Scalars['Int'],
  LearningGoalProgress: APILearningGoalProgress,
  LearningGoalStarted: APILearningGoalStarted,
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions,
  LearningGoalStartedByResults: APILearningGoalStartedByResults,
  LearningGoalStartedByItem: APILearningGoalStartedByItem,
  RequiredInGoalItem: APIRequiredInGoalItem,
  SubGoalItem: Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] },
  SubGoal: APIResolversParentTypes['LearningGoal'] | APIResolversParentTypes['Topic'],
  CreateLearningGoalPayload: APICreateLearningGoalPayload,
  CreateLearningGoalOptions: APICreateLearningGoalOptions,
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload,
  AttachLearningGoalToDomainPayload: APIAttachLearningGoalToDomainPayload,
  DeleteLearningGoalMutationResult: APIDeleteLearningGoalMutationResult,
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
  LearningMaterialCoveredSubTopicsOptions: APILearningMaterialCoveredSubTopicsOptions,
  LearningMaterialCoveredSubTopicsResults: APILearningMaterialCoveredSubTopicsResults,
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
  CreateSubResourcePayload: APICreateSubResourcePayload,
  CreateResourcePayload: APICreateResourcePayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  DeleteResourceResponse: APIDeleteResourceResponse,
  SubResourceCreatedResult: APISubResourceCreatedResult,
  SubResourceSeriesCreatedResult: APISubResourceSeriesCreatedResult,
  SearchResourcesOptions: APISearchResourcesOptions,
  SearchResourcesResult: APISearchResourcesResult,
  SubResourceExtractedData: APISubResourceExtractedData,
  ResourceData: APIResourceData,
  AnalyzeResourceUrlResult: APIAnalyzeResourceUrlResult,
  Topic: APITopic,
  TopicSubTopicsSortingType: APITopicSubTopicsSortingType,
  TopicSubTopicsSortingOptions: APITopicSubTopicsSortingOptions,
  TopicSubTopicsOptions: APITopicSubTopicsOptions,
  SearchTopicsOptions: APISearchTopicsOptions,
  SearchTopicsResult: APISearchTopicsResult,
  TopicLearningMaterialsSortingType: APITopicLearningMaterialsSortingType,
  TopicLearningMaterialsFilterOptions: APITopicLearningMaterialsFilterOptions,
  TopicLearningMaterialsOptions: APITopicLearningMaterialsOptions,
  TopicLearningMaterialsResults: APITopicLearningMaterialsResults,
  TopicHasPrerequisiteTopicItem: APITopicHasPrerequisiteTopicItem,
  CheckTopicKeyAvailabilityResult: APICheckTopicKeyAvailabilityResult,
  KnownTopic: APIKnownTopic,
  CreateTopicPayload: APICreateTopicPayload,
  UpdateTopicPayload: APIUpdateTopicPayload,
  DeleteTopicResponse: APIDeleteTopicResponse,
  SetTopicKnownPayloadTopicsField: APISetTopicKnownPayloadTopicsField,
  SetTopicsKnownPayload: APISetTopicsKnownPayload,
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
  SearchResultEntity: APIResolversParentTypes['LearningGoal'] | APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'] | APIResolversParentTypes['Topic'],
  SearchResult: Omit<APISearchResult, 'entity'> & { entity: APIResolversParentTypes['SearchResultEntity'] },
  GlobalSearchResults: APIGlobalSearchResults,
  GetTopLevelTopicsResults: APIGetTopLevelTopicsResults,
  Date: Scalars['Date'],
  AddTopicHasPrerequisiteTopicResult: APIAddTopicHasPrerequisiteTopicResult,
  TopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic,
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload,
  DetachTopicIsSubTopicOfTopicResult: APIDetachTopicIsSubTopicOfTopicResult,
  RemoveTopicHasPrerequisiteTopicResult: APIRemoveTopicHasPrerequisiteTopicResult,
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload,
  LearningMaterialHasPrerequisiteTopic: APILearningMaterialHasPrerequisiteTopic,
  PaginationOptions: APIPaginationOptions,
  TopicHasPrerequisiteTopic: APITopicHasPrerequisiteTopic,
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
  checkTopicKeyAvailability?: Resolver<APIResolversTypes['CheckTopicKeyAvailabilityResult'], ParentType, ContextType, RequireFields<APIQueryCheckTopicKeyAvailabilityArgs, 'key'>>,
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>,
  getArticleByKey?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleByKeyArgs, 'key'>>,
  getHomePageData?: Resolver<APIResolversTypes['GetHomePageDataResults'], ParentType, ContextType>,
  getLearningGoalByKey?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIQueryGetLearningGoalByKeyArgs, 'key'>>,
  getLearningPathById?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByIdArgs, 'learningPathId'>>,
  getLearningPathByKey?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByKeyArgs, 'learningPathKey'>>,
  getResourceById?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByIdArgs, 'resourceId'>>,
  getResourceByKey?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByKeyArgs, 'resourceKey'>>,
  getTopLevelTopics?: Resolver<APIResolversTypes['GetTopLevelTopicsResults'], ParentType, ContextType>,
  getTopicById?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIQueryGetTopicByIdArgs, 'topicId'>>,
  getTopicByKey?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIQueryGetTopicByKeyArgs, 'topicKey'>>,
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>,
  globalSearch?: Resolver<APIResolversTypes['GlobalSearchResults'], ParentType, ContextType, RequireFields<APIQueryGlobalSearchArgs, 'query'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  searchLearningGoals?: Resolver<APIResolversTypes['SearchLearningGoalsResult'], ParentType, ContextType, RequireFields<APIQuerySearchLearningGoalsArgs, 'options'>>,
  searchLearningMaterialTags?: Resolver<Array<APIResolversTypes['LearningMaterialTagSearchResult']>, ParentType, ContextType, RequireFields<APIQuerySearchLearningMaterialTagsArgs, 'options'>>,
  searchResources?: Resolver<APIResolversTypes['SearchResourcesResult'], ParentType, ContextType, RequireFields<APIQuerySearchResourcesArgs, 'options' | 'query'>>,
  searchSubTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchSubTopicsArgs, 'options' | 'topicId'>>,
  searchTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchTopicsArgs, 'options'>>,
}>;

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  addComplementaryResourceToLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationAddComplementaryResourceToLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  addLearningMaterialHasPrerequisiteTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddLearningMaterialHasPrerequisiteTopicArgs, 'learningMaterialId' | 'prerequisiteTopicId'>>,
  addSubResource?: Resolver<APIResolversTypes['SubResourceCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceArgs, 'parentResourceId' | 'subResourceId'>>,
  addSubResourceToSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceToSeriesArgs, 'parentResourceId' | 'previousResourceId' | 'subResourceId'>>,
  addSubTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationAddSubTopicArgs, 'parentTopicId' | 'payload'>>,
  addTagsToLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddTagsToLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  addTopicHasPrerequisiteTopic?: Resolver<APIResolversTypes['AddTopicHasPrerequisiteTopicResult'], ParentType, ContextType, RequireFields<APIMutationAddTopicHasPrerequisiteTopicArgs, 'topicId' | 'prerequisiteTopicId'>>,
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>,
  attachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>,
  attachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['AttachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'payload' | 'subGoalId'>>,
  attachLearningMaterialCoversTopics?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialCoversTopicsArgs, 'learningMaterialId' | 'topicsIds'>>,
  attachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationAttachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId' | 'payload'>>,
  completeLearningPath?: Resolver<APIResolversTypes['LearningPathCompletedResult'], ParentType, ContextType, RequireFields<APIMutationCompleteLearningPathArgs, 'completed' | 'learningPathId'>>,
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>,
  createLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationCreateLearningGoalArgs, 'payload'>>,
  createLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationCreateLearningPathArgs, 'payload'>>,
  createResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationCreateResourceArgs, 'payload'>>,
  createSubResourceSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationCreateSubResourceSeriesArgs, 'parentResourceId' | 'subResourceId'>>,
  createTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationCreateTopicArgs, 'payload'>>,
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>,
  deleteLearningGoal?: Resolver<APIResolversTypes['DeleteLearningGoalMutationResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningGoalArgs, '_id'>>,
  deleteLearningPath?: Resolver<APIResolversTypes['DeleteLearningPathResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningPathArgs, 'learningPathId'>>,
  deleteResource?: Resolver<APIResolversTypes['DeleteResourceResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteResourceArgs, 'resourceId'>>,
  deleteTopic?: Resolver<APIResolversTypes['DeleteTopicResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteTopicArgs, 'topicId'>>,
  detachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>,
  detachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['DetachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'subGoalId'>>,
  detachLearningMaterialCoversTopics?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialCoversTopicsArgs, 'learningMaterialId' | 'topicsIds'>>,
  detachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['DetachTopicIsSubTopicOfTopicResult'], ParentType, ContextType, RequireFields<APIMutationDetachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId'>>,
  hideLearningMaterialFromTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationHideLearningMaterialFromTopicArgs, 'learningMaterialId' | 'topicId'>>,
  indexLearningGoal?: Resolver<APIResolversTypes['LearningGoalIndexedResult'], ParentType, ContextType, RequireFields<APIMutationIndexLearningGoalArgs, 'learningGoalId'>>,
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  loginGoogle?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginGoogleArgs, 'idToken'>>,
  publishLearningGoal?: Resolver<APIResolversTypes['LearningGoalPublishedResult'], ParentType, ContextType, RequireFields<APIMutationPublishLearningGoalArgs, 'learningGoalId'>>,
  rateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationRateLearningGoalArgs, 'learningGoalId' | 'value'>>,
  rateLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRateLearningMaterialArgs, 'learningMaterialId' | 'value'>>,
  recommendLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRecommendLearningMaterialArgs, 'learningMaterialId'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
  registerGoogle?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterGoogleArgs, 'payload'>>,
  removeComplementaryResourceFromLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationRemoveComplementaryResourceFromLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  removeLearningMaterialHasPrerequisiteTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveLearningMaterialHasPrerequisiteTopicArgs, 'learningMaterialId' | 'prerequisiteTopicId'>>,
  removeTagsFromLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveTagsFromLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  removeTopicHasPrerequisiteTopic?: Resolver<APIResolversTypes['RemoveTopicHasPrerequisiteTopicResult'], ParentType, ContextType, RequireFields<APIMutationRemoveTopicHasPrerequisiteTopicArgs, 'topicId' | 'prerequisiteTopicId'>>,
  resetPassword?: Resolver<APIResolversTypes['ResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationResetPasswordArgs, 'payload'>>,
  setResourcesConsumed?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType, RequireFields<APIMutationSetResourcesConsumedArgs, 'payload'>>,
  setTopicsKnown?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType, RequireFields<APIMutationSetTopicsKnownArgs, 'payload'>>,
  setTopicsUnknown?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType, RequireFields<APIMutationSetTopicsUnknownArgs, 'topicIds'>>,
  showLearningMaterialInTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationShowLearningMaterialInTopicArgs, 'learningMaterialId' | 'topicId'>>,
  startLearningGoal?: Resolver<APIResolversTypes['LearningGoalStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningGoalArgs, 'learningGoalId'>>,
  startLearningPath?: Resolver<APIResolversTypes['LearningPathStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningPathArgs, 'learningPathId'>>,
  triggerResetPassword?: Resolver<APIResolversTypes['TriggerResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationTriggerResetPasswordArgs, 'email'>>,
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>,
  updateCurrentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationUpdateCurrentUserArgs, 'payload'>>,
  updateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningGoalArgs, '_id' | 'payload'>>,
  updateLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningPathArgs, 'learningPathId' | 'payload'>>,
  updateResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationUpdateResourceArgs, 'payload' | 'resourceId'>>,
  updateTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicArgs, 'topicId' | 'payload'>>,
  updateTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId' | 'payload'>>,
  verifyEmailAddress?: Resolver<APIResolversTypes['VerifyEmailResponse'], ParentType, ContextType, RequireFields<APIMutationVerifyEmailAddressArgs, 'token'>>,
}>;

export type APILearningGoalResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoal'] = APIResolversParentTypes['LearningGoal']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  dependantLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependantLearningGoalsArgs, never>>,
  dependsOnLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependsOnLearningGoalsArgs, never>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  hidden?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  progress?: Resolver<Maybe<APIResolversTypes['LearningGoalProgress']>, ParentType, ContextType>,
  publishedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  relevantLearningMaterials?: Resolver<Maybe<APIResolversTypes['LearningGoalRelevantLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APILearningGoalRelevantLearningMaterialsArgs, 'options'>>,
  requiredInGoals?: Resolver<Maybe<Array<APIResolversTypes['RequiredInGoalItem']>>, ParentType, ContextType>,
  requiredSubGoals?: Resolver<Maybe<Array<APIResolversTypes['SubGoalItem']>>, ParentType, ContextType>,
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  started?: Resolver<Maybe<APIResolversTypes['LearningGoalStarted']>, ParentType, ContextType>,
  startedBy?: Resolver<Maybe<APIResolversTypes['LearningGoalStartedByResults']>, ParentType, ContextType, RequireFields<APILearningGoalStartedByArgs, 'options'>>,
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
  __resolveType: TypeResolveFn<'LearningGoal' | 'Topic', ParentType, ContextType>
}>;

export type APIDeleteLearningGoalMutationResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteLearningGoalMutationResult'] = APIResolversParentTypes['DeleteLearningGoalMutationResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
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
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APILearningMaterialCoveredSubTopicsArgs, 'options'>>,
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>,
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
}>;

export type APILearningMaterialCoveredSubTopicsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialCoveredSubTopicsResults'] = APIResolversParentTypes['LearningMaterialCoveredSubTopicsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>,
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
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APILearningPathCoveredSubTopicsArgs, 'options'>>,
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>,
  public?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  resourceItems?: Resolver<Maybe<Array<APIResolversTypes['LearningPathResourceItem']>>, ParentType, ContextType>,
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
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
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APIResourceCoveredSubTopicsArgs, 'options'>>,
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<APIResolversTypes['ResourceMediaType'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  nextResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  parentResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>,
  previousResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  seriesParentResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>,
  subResourceSeries?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  subResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['ResourceType'], ParentType, ContextType>,
  upvotes?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
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

export type APITopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Topic'] = APIResolversParentTypes['Topic']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  followUps?: Resolver<Maybe<Array<APIResolversTypes['TopicHasPrerequisiteTopicItem']>>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  learningMaterials?: Resolver<Maybe<APIResolversTypes['TopicLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APITopicLearningMaterialsArgs, 'options'>>,
  learningMaterialsTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  parentTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>,
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['TopicHasPrerequisiteTopicItem']>>, ParentType, ContextType>,
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APITopicSubTopicsArgs, 'options'>>,
  subTopicsTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchTopicsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchTopicsResult'] = APIResolversParentTypes['SearchTopicsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITopicLearningMaterialsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicLearningMaterialsResults'] = APIResolversParentTypes['TopicLearningMaterialsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['LearningMaterial']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITopicHasPrerequisiteTopicItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicHasPrerequisiteTopicItem'] = APIResolversParentTypes['TopicHasPrerequisiteTopicItem']> = ResolversObject<{
  relationship?: Resolver<APIResolversTypes['TopicHasPrerequisiteTopic'], ParentType, ContextType>,
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APICheckTopicKeyAvailabilityResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CheckTopicKeyAvailabilityResult'] = APIResolversParentTypes['CheckTopicKeyAvailabilityResult']> = ResolversObject<{
  available?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  existingTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIKnownTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['KnownTopic'] = APIResolversParentTypes['KnownTopic']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteTopicResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteTopicResponse'] = APIResolversParentTypes['DeleteTopicResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
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
  __resolveType: TypeResolveFn<'LearningGoal' | 'LearningPath' | 'Resource' | 'Topic', ParentType, ContextType>
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

export type APIGetTopLevelTopicsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopLevelTopicsResults'] = APIResolversParentTypes['GetTopLevelTopicsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface APIDateScalarConfig extends GraphQLScalarTypeConfig<APIResolversTypes['Date'], any> {
  name: 'Date'
}

export type APIAddTopicHasPrerequisiteTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AddTopicHasPrerequisiteTopicResult'] = APIResolversParentTypes['AddTopicHasPrerequisiteTopicResult']> = ResolversObject<{
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  prerequisiteTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITopicIsSubTopicOfTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicIsSubTopicOfTopic'] = APIResolversParentTypes['TopicIsSubTopicOfTopic']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  createdByUserId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  parentTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult'] = APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult']> = ResolversObject<{
  parentTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIRemoveTopicHasPrerequisiteTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['RemoveTopicHasPrerequisiteTopicResult'] = APIResolversParentTypes['RemoveTopicHasPrerequisiteTopicResult']> = ResolversObject<{
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  prerequisiteTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningMaterialHasPrerequisiteTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialHasPrerequisiteTopic'] = APIResolversParentTypes['LearningMaterialHasPrerequisiteTopic']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  createdByUserId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>,
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>,
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APITopicHasPrerequisiteTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicHasPrerequisiteTopic'] = APIResolversParentTypes['TopicHasPrerequisiteTopic']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  Article?: APIArticleResolvers<ContextType>,
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>,
  Query?: APIQueryResolvers<ContextType>,
  DeleteArticleResponse?: APIDeleteArticleResponseResolvers<ContextType>,
  Mutation?: APIMutationResolvers<ContextType>,
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
  SearchLearningGoalsResult?: APISearchLearningGoalsResultResolvers<ContextType>,
  AttachLearningGoalRequiresSubGoalResult?: APIAttachLearningGoalRequiresSubGoalResultResolvers<ContextType>,
  DetachLearningGoalRequiresSubGoalResult?: APIDetachLearningGoalRequiresSubGoalResultResolvers<ContextType>,
  LearningGoalStartedResult?: APILearningGoalStartedResultResolvers<ContextType>,
  LearningGoalPublishedResult?: APILearningGoalPublishedResultResolvers<ContextType>,
  LearningGoalIndexedResult?: APILearningGoalIndexedResultResolvers<ContextType>,
  UpdateLearningGoalDependenciesResult?: APIUpdateLearningGoalDependenciesResultResolvers<ContextType>,
  LearningMaterial?: APILearningMaterialResolvers,
  LearningMaterialCoveredSubTopicsResults?: APILearningMaterialCoveredSubTopicsResultsResolvers<ContextType>,
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
  DeleteResourceResponse?: APIDeleteResourceResponseResolvers<ContextType>,
  SubResourceCreatedResult?: APISubResourceCreatedResultResolvers<ContextType>,
  SubResourceSeriesCreatedResult?: APISubResourceSeriesCreatedResultResolvers<ContextType>,
  SearchResourcesResult?: APISearchResourcesResultResolvers<ContextType>,
  SubResourceExtractedData?: APISubResourceExtractedDataResolvers<ContextType>,
  ResourceData?: APIResourceDataResolvers<ContextType>,
  AnalyzeResourceUrlResult?: APIAnalyzeResourceUrlResultResolvers<ContextType>,
  Topic?: APITopicResolvers<ContextType>,
  SearchTopicsResult?: APISearchTopicsResultResolvers<ContextType>,
  TopicLearningMaterialsResults?: APITopicLearningMaterialsResultsResolvers<ContextType>,
  TopicHasPrerequisiteTopicItem?: APITopicHasPrerequisiteTopicItemResolvers<ContextType>,
  CheckTopicKeyAvailabilityResult?: APICheckTopicKeyAvailabilityResultResolvers<ContextType>,
  KnownTopic?: APIKnownTopicResolvers<ContextType>,
  DeleteTopicResponse?: APIDeleteTopicResponseResolvers<ContextType>,
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
  GetTopLevelTopicsResults?: APIGetTopLevelTopicsResultsResolvers<ContextType>,
  Date?: GraphQLScalarType,
  AddTopicHasPrerequisiteTopicResult?: APIAddTopicHasPrerequisiteTopicResultResolvers<ContextType>,
  TopicIsSubTopicOfTopic?: APITopicIsSubTopicOfTopicResolvers<ContextType>,
  DetachTopicIsSubTopicOfTopicResult?: APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType>,
  RemoveTopicHasPrerequisiteTopicResult?: APIRemoveTopicHasPrerequisiteTopicResultResolvers<ContextType>,
  LearningMaterialHasPrerequisiteTopic?: APILearningMaterialHasPrerequisiteTopicResolvers<ContextType>,
  TopicHasPrerequisiteTopic?: APITopicHasPrerequisiteTopicResolvers<ContextType>,
}>;


