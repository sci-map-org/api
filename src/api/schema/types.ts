import { ArticleContentType } from '../../entities/Article';
import { UserRole } from '../../entities/User';
import { ResourceType } from '../../entities/Resource';
import { LearningGoalType } from '../../entities/LearningGoal';
import { SubTopicRelationshipType } from '../../entities/relationships/TopicIsSubTopicOfTopic';
import { PulledDescriptionSourceName } from '../../services/pull_topic_descriptions.service';
import { TopicTypeColor } from '../../entities/TopicType';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { APIContext } from '../server';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
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

export type APIAddTopicHasPrerequisiteTopicResult = {
  __typename?: 'AddTopicHasPrerequisiteTopicResult';
  prerequisiteTopic: APITopic;
  strength: Scalars['Float'];
  topic: APITopic;
};

export type APIAdminUpdateUserPayload = {
  active?: InputMaybe<Scalars['Boolean']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  profilePictureUrl?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<UserRole>;
};

export type APIAggregatedSubtopicPrerequisite = {
  __typename?: 'AggregatedSubtopicPrerequisite';
  prerequisiteParentsPath: Array<APITopic>;
  relationship: APITopicHasPrerequisiteTopic;
  subTopicPath: Array<APITopic>;
};

export type APIAggregatedSubtopicsPrerequisitesOptions = {
  onlyIfTopicHasTopicTypes?: InputMaybe<Array<Scalars['String']>>;
  prereqParentsPathStopCondition: APIPrereqParentsPathStopCondition;
};

export type APIAnalyzeResourceUrlResult = {
  __typename?: 'AnalyzeResourceUrlResult';
  resourceData?: Maybe<APIResourceData>;
};

export type APIArticle = {
  __typename?: 'Article';
  _id: Scalars['String'];
  author?: Maybe<APIUser>;
  content: Scalars['String'];
  contentType: ArticleContentType;
  key: Scalars['String'];
  title: Scalars['String'];
};

export { ArticleContentType };

export type APIAttachLearningGoalRequiresSubGoalPayload = {
  strength?: InputMaybe<Scalars['Float']>;
};

export type APIAttachLearningGoalRequiresSubGoalResult = {
  __typename?: 'AttachLearningGoalRequiresSubGoalResult';
  learningGoal: APILearningGoal;
  subGoal: APISubGoal;
};

export type APIAttachTopicIsPartOfTopicPayload = {
  index?: InputMaybe<Scalars['Float']>;
};

export type APIAttachTopicIsSubTopicOfTopicPayload = {
  index?: InputMaybe<Scalars['Float']>;
};

export type APICheckLearningGoalKeyAvailabilityResult = {
  __typename?: 'CheckLearningGoalKeyAvailabilityResult';
  available: Scalars['Boolean'];
  existingLearningGoal?: Maybe<APILearningGoal>;
};

export type APICheckTopicKeyAvailabilityResult = {
  __typename?: 'CheckTopicKeyAvailabilityResult';
  available: Scalars['Boolean'];
  existingTopic?: Maybe<APITopic>;
};

export type APICheckUserKeyAvailabilityResult = {
  __typename?: 'CheckUserKeyAvailabilityResult';
  available: Scalars['Boolean'];
  existingUser?: Maybe<APIUser>;
};

export type APIComment = {
  __typename?: 'Comment';
  _id: Scalars['String'];
  children?: Maybe<Array<APIComment>>;
  childrenCount?: Maybe<Scalars['Int']>;
  contentMarkdown: Scalars['String'];
  discussionId: Scalars['String'];
  lastUpdatedAt: Scalars['String'];
  parent?: Maybe<APIComment>;
  parentId?: Maybe<Scalars['String']>;
  postedAt: Scalars['String'];
  postedBy?: Maybe<APIUser>;
  postedByUserId: Scalars['String'];
};

export type APICommentOptions = {
  pagination: APIPaginationOptions;
};

export type APICommentResults = {
  __typename?: 'CommentResults';
  items: Array<APIComment>;
  rootCommentsTotalCount: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type APIComplementaryResourceUpdatedResult = {
  __typename?: 'ComplementaryResourceUpdatedResult';
  learningPath: APILearningPath;
  resource: APIResource;
};

export type APIConsumedResource = {
  __typename?: 'ConsumedResource';
  consumedAt?: Maybe<Scalars['Date']>;
  lastOpenedAt?: Maybe<Scalars['Date']>;
  openedAt?: Maybe<Scalars['Date']>;
};

export type APICreateArticlePayload = {
  content: Scalars['String'];
  contentType: ArticleContentType;
  title: Scalars['String'];
};

export type APICreateLearningGoalOptions = {
  public?: InputMaybe<Scalars['Boolean']>;
  topicId?: InputMaybe<Scalars['String']>;
};

export type APICreateLearningGoalPayload = {
  description?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  type: LearningGoalType;
};

export type APICreateLearningPathPayload = {
  description?: InputMaybe<Scalars['String']>;
  durationSeconds?: InputMaybe<Scalars['Int']>;
  key?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  outro?: InputMaybe<Scalars['String']>;
  public?: InputMaybe<Scalars['Boolean']>;
  resourceItems: Array<APICreateLearningPathResourceItem>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type APICreateLearningPathResourceItem = {
  description?: InputMaybe<Scalars['String']>;
  resourceId: Scalars['String'];
};

export type APICreateResourceOptions = {
  recommend?: InputMaybe<Scalars['Boolean']>;
};

export type APICreateResourcePayload = {
  coveredSubTopicsIds?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  durationSeconds?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  prerequisitesTopicsIds?: InputMaybe<Array<Scalars['String']>>;
  showInTopicsIds: Array<Scalars['String']>;
  subResourceSeries?: InputMaybe<Array<APICreateSubResourcePayload>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  types: Array<ResourceType>;
  url: Scalars['String'];
};

export type APICreateSubResourcePayload = {
  coveredSubTopicsIds?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  durationSeconds?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  prerequisitesTopicsIds?: InputMaybe<Array<Scalars['String']>>;
  showInTopicsIds: Array<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  types: Array<ResourceType>;
  url: Scalars['String'];
};

export type APICreateTopicContextOptions = {
  contextTopicId: Scalars['String'];
  disambiguationTopicId: Scalars['String'];
};

export type APICreateTopicPayload = {
  aliases?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  descriptionSourceUrl?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
  level?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  prerequisitesTopicsIds: Array<Scalars['String']>;
  topicTypes: Array<Scalars['String']>;
  wikipediaPageUrl?: InputMaybe<Scalars['String']>;
};

export type APICurrentUser = {
  __typename?: 'CurrentUser';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  bio?: Maybe<Scalars['String']>;
  consumedResources?: Maybe<APIUserConsumedResourcesResult>;
  createdLearningPaths?: Maybe<Array<APILearningPath>>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  profilePictureUrl?: Maybe<Scalars['String']>;
  role: UserRole;
  startedLearningPaths?: Maybe<Array<APILearningPathStartedItem>>;
};


export type APICurrentUserArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APICurrentUserConsumedResourcesArgs = {
  options: APIUserConsumedResourcesOptions;
};


export type APICurrentUserCreatedLearningPathsArgs = {
  options: APIUserLearningPathsOptions;
};


export type APICurrentUserStartedLearningPathsArgs = {
  options: APIUserLearningPathsOptions;
};

export type APIDeleteArticleResponse = {
  __typename?: 'DeleteArticleResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteLearningGoalMutationResult = {
  __typename?: 'DeleteLearningGoalMutationResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteLearningPathResult = {
  __typename?: 'DeleteLearningPathResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteResourceResponse = {
  __typename?: 'DeleteResourceResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteTopicResponse = {
  __typename?: 'DeleteTopicResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDependsOnGoalItem = {
  __typename?: 'DependsOnGoalItem';
  learningGoal: APILearningGoal;
  parentLearningGoalId: Scalars['String'];
};

export type APIDetachLearningGoalRequiresSubGoalResult = {
  __typename?: 'DetachLearningGoalRequiresSubGoalResult';
  learningGoal: APILearningGoal;
  subGoal: APISubGoal;
};

export type APIDetachTopicIsPartOfTopicResult = {
  __typename?: 'DetachTopicIsPartOfTopicResult';
  partOfTopic: APITopic;
  subTopic: APITopic;
};

export type APIDetachTopicIsSubTopicOfTopicResult = {
  __typename?: 'DetachTopicIsSubTopicOfTopicResult';
  parentTopic: APITopic;
  subTopic: APITopic;
};

export type APIDiscourseSso = {
  sig: Scalars['String'];
  sso: Scalars['String'];
};

export enum APIDiscussionLocation {
  LearningMaterialPage = 'LEARNING_MATERIAL_PAGE',
  ManageTopicPage = 'MANAGE_TOPIC_PAGE',
  TopicPage = 'TOPIC_PAGE'
}

export type APIEditCommentPayload = {
  contentMarkdown: Scalars['String'];
};

export type APIGetHomePageDataResults = {
  __typename?: 'GetHomePageDataResults';
  currentUser?: Maybe<APICurrentUser>;
  recommendedLearningPaths: Array<APILearningPath>;
};

export type APIGetTopLevelTopicsResults = {
  __typename?: 'GetTopLevelTopicsResults';
  items: Array<APITopic>;
};

export type APIGetTopicValidContextsFromDisambiguation = {
  __typename?: 'GetTopicValidContextsFromDisambiguation';
  validContexts?: Maybe<Array<APITopic>>;
};

export type APIGetTopicValidContextsFromSameName = {
  __typename?: 'GetTopicValidContextsFromSameName';
  validContexts?: Maybe<Array<APITopic>>;
  validSameNameTopicContexts?: Maybe<Array<APITopic>>;
};

export type APIGetTopicValidContextsResult = {
  __typename?: 'GetTopicValidContextsResult';
  validContexts?: Maybe<Array<APITopic>>;
};

export type APIGlobalSearchOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APIGlobalSearchResults = {
  __typename?: 'GlobalSearchResults';
  results: Array<APISearchResult>;
};

export type APIKnownTopic = {
  __typename?: 'KnownTopic';
  level: Scalars['Float'];
};

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
  parentLearningGoalIdIn?: InputMaybe<Array<Scalars['String']>>;
};


export type APILearningGoalDependsOnLearningGoalsArgs = {
  parentLearningGoalIdIn?: InputMaybe<Array<Scalars['String']>>;
};


export type APILearningGoalRelevantLearningMaterialsArgs = {
  options: APILearningGoalRelevantLearningMaterialsOptions;
};


export type APILearningGoalStartedByArgs = {
  options: APILearningGoalStartedByOptions;
};

export type APILearningGoalIndexedResult = {
  __typename?: 'LearningGoalIndexedResult';
  learningGoal: APILearningGoal;
};

export type APILearningGoalProgress = {
  __typename?: 'LearningGoalProgress';
  level: Scalars['Float'];
};

export type APILearningGoalPublishedResult = {
  __typename?: 'LearningGoalPublishedResult';
  learningGoal: APILearningGoal;
};

export type APILearningGoalRelevantLearningMaterialsItem = {
  __typename?: 'LearningGoalRelevantLearningMaterialsItem';
  coverage?: Maybe<Scalars['Float']>;
  learningMaterial: APILearningMaterial;
};

export type APILearningGoalRelevantLearningMaterialsOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APILearningGoalRelevantLearningMaterialsResults = {
  __typename?: 'LearningGoalRelevantLearningMaterialsResults';
  count: Scalars['Int'];
  items: Array<APILearningGoalRelevantLearningMaterialsItem>;
};

export type APILearningGoalStarted = {
  __typename?: 'LearningGoalStarted';
  startedAt: Scalars['Date'];
};

export type APILearningGoalStartedByItem = {
  __typename?: 'LearningGoalStartedByItem';
  startedAt: Scalars['Date'];
  user: APIUser;
};

export type APILearningGoalStartedByOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APILearningGoalStartedByResults = {
  __typename?: 'LearningGoalStartedByResults';
  count: Scalars['Int'];
  items: Array<APILearningGoalStartedByItem>;
};

export type APILearningGoalStartedResult = {
  __typename?: 'LearningGoalStartedResult';
  currentUser: APICurrentUser;
  learningGoal: APILearningGoal;
};

export { LearningGoalType };

export type APILearningMaterial = {
  _id: Scalars['String'];
  comments?: Maybe<APICommentResults>;
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  rating?: Maybe<Scalars['Float']>;
  recommendationsCount?: Maybe<Scalars['Int']>;
  recommended?: Maybe<APILearningMaterialRecommended>;
  recommendedBy?: Maybe<Array<APIUserRecommendedLearningMaterial>>;
  showedIn?: Maybe<Array<APITopic>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningMaterialCommentsArgs = {
  options: APICommentOptions;
};


export type APILearningMaterialCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
};


export type APILearningMaterialRecommendedByArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type APILearningMaterialCoveredSubTopicsOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APILearningMaterialCoveredSubTopicsResults = {
  __typename?: 'LearningMaterialCoveredSubTopicsResults';
  items: Array<APITopic>;
};

export type APILearningMaterialCoversTopic = {
  __typename?: 'LearningMaterialCoversTopic';
  createdAt: Scalars['Date'];
  createdByUserId?: Maybe<Scalars['String']>;
  learningMaterial: APILearningMaterial;
  topic: APITopic;
};

export type APILearningMaterialHasPrerequisiteTopic = {
  __typename?: 'LearningMaterialHasPrerequisiteTopic';
  createdAt: Scalars['Date'];
  createdByUserId: Scalars['String'];
  learningMaterial: APILearningMaterial;
  strength: Scalars['Float'];
  topic: APITopic;
};

export type APILearningMaterialRecommended = {
  __typename?: 'LearningMaterialRecommended';
  recommendedAt: Scalars['Date'];
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

export enum APILearningMaterialType {
  LearningPath = 'LearningPath',
  Resource = 'Resource'
}

export type APILearningPath = APILearningMaterial & {
  __typename?: 'LearningPath';
  _id: Scalars['String'];
  comments?: Maybe<APICommentResults>;
  complementaryResources?: Maybe<Array<APIResource>>;
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  key: Scalars['String'];
  name: Scalars['String'];
  outro?: Maybe<Scalars['String']>;
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  public: Scalars['Boolean'];
  rating?: Maybe<Scalars['Float']>;
  recommendationsCount?: Maybe<Scalars['Int']>;
  recommended?: Maybe<APILearningMaterialRecommended>;
  recommendedBy?: Maybe<Array<APIUserRecommendedLearningMaterial>>;
  resourceItems?: Maybe<Array<APILearningPathResourceItem>>;
  showedIn?: Maybe<Array<APITopic>>;
  started?: Maybe<APILearningPathStarted>;
  startedBy?: Maybe<APILearningPathStartedByResults>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningPathCommentsArgs = {
  options: APICommentOptions;
};


export type APILearningPathCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
};


export type APILearningPathRecommendedByArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type APILearningPathStartedByArgs = {
  options: APILearningPathStartedByOptions;
};

export type APILearningPathCompletedResult = {
  __typename?: 'LearningPathCompletedResult';
  learningPath: APILearningPath;
  user: APICurrentUser;
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

export type APILearningPathStartedByItem = {
  __typename?: 'LearningPathStartedByItem';
  completedAt?: Maybe<Scalars['Date']>;
  startedAt: Scalars['Date'];
  user: APIUser;
};

export type APILearningPathStartedByOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APILearningPathStartedByResults = {
  __typename?: 'LearningPathStartedByResults';
  count: Scalars['Int'];
  items: Array<APILearningPathStartedByItem>;
};

export type APILearningPathStartedItem = {
  __typename?: 'LearningPathStartedItem';
  completedAt?: Maybe<Scalars['Date']>;
  learningPath: APILearningPath;
  startedAt: Scalars['Date'];
};

export type APILearningPathStartedResult = {
  __typename?: 'LearningPathStartedResult';
  learningPath: APILearningPath;
  user: APICurrentUser;
};

export type APIListArticlesFilter = {
  contentType?: InputMaybe<ArticleContentType>;
};

export type APIListArticlesOptions = {
  filter?: InputMaybe<APIListArticlesFilter>;
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APIListArticlesResult = {
  __typename?: 'ListArticlesResult';
  items: Array<APIArticle>;
};

export type APILoginResponse = {
  __typename?: 'LoginResponse';
  currentUser: APICurrentUser;
  jwt: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
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
  addTopicTypesToTopic: APITopic;
  adminUpdateUser: APIUser;
  attachLearningGoalDependency: APIUpdateLearningGoalDependenciesResult;
  attachLearningGoalRequiresSubGoal: APIAttachLearningGoalRequiresSubGoalResult;
  attachLearningMaterialCoversTopics: APILearningMaterial;
  attachTopicIsPartOfTopic: APITopicIsPartOfTopic;
  attachTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  completeLearningPath: APILearningPathCompletedResult;
  createArticle: APIArticle;
  createDisambiguationFromTopic: APITopic;
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
  detachTopicIsPartOfTopic: APIDetachTopicIsPartOfTopicResult;
  detachTopicIsSubTopicOfTopic: APIDetachTopicIsSubTopicOfTopicResult;
  downvoteLearningMaterial: APILearningMaterial;
  editComment: APIComment;
  hideLearningGoalFromTopic: APIShowLearningGoalInTopicResult;
  hideLearningMaterialFromTopic: APILearningMaterial;
  indexLearningGoal: APILearningGoalIndexedResult;
  login: APILoginResponse;
  loginGoogle: APILoginResponse;
  postComment: APIComment;
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
  removeTopicTypesFromTopic: APITopic;
  resetPassword: APIResetPasswordResponse;
  setResourcesConsumed: Array<APIResource>;
  setTopicsKnown: Array<APITopic>;
  setTopicsUnknown: Array<APITopic>;
  showLearningGoalInTopic: APIShowLearningGoalInTopicResult;
  showLearningMaterialInTopic: APILearningMaterial;
  startLearningGoal: APILearningGoalStartedResult;
  startLearningPath: APILearningPathStartedResult;
  triggerResetPassword: APITriggerResetPasswordResponse;
  updateArticle: APIArticle;
  updateCurrentUser: APICurrentUser;
  updateLearningGoal: APILearningGoal;
  updateLearningPath: APILearningPath;
  updateResource: APIResource;
  updateTopic: APITopic;
  updateTopicContext: APITopic;
  updateTopicIsPartOfTopic: APITopicIsPartOfTopic;
  updateTopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  updateTopicTopicTypes: APITopic;
  verifyEmailAddress: APIVerifyEmailResponse;
};


export type APIMutationAddComplementaryResourceToLearningPathArgs = {
  learningPathId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationAddLearningMaterialHasPrerequisiteTopicArgs = {
  learningMaterialId: Scalars['String'];
  prerequisiteTopicId: Scalars['String'];
  strength?: InputMaybe<Scalars['Float']>;
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
  contextOptions?: InputMaybe<APICreateTopicContextOptions>;
  parentTopicId: Scalars['String'];
  payload: APICreateTopicPayload;
};


export type APIMutationAddTagsToLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationAddTopicHasPrerequisiteTopicArgs = {
  prerequisiteTopicId: Scalars['String'];
  strength?: InputMaybe<Scalars['Float']>;
  topicId: Scalars['String'];
};


export type APIMutationAddTopicTypesToTopicArgs = {
  topicId: Scalars['String'];
  topicTypes: Array<Scalars['String']>;
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


export type APIMutationAttachTopicIsPartOfTopicArgs = {
  partOfTopicId: Scalars['String'];
  payload: APIAttachTopicIsPartOfTopicPayload;
  subTopicId: Scalars['String'];
};


export type APIMutationAttachTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  payload: APIAttachTopicIsSubTopicOfTopicPayload;
  subTopicId: Scalars['String'];
};


export type APIMutationCompleteLearningPathArgs = {
  completed: Scalars['Boolean'];
  learningPathId: Scalars['String'];
};


export type APIMutationCreateArticleArgs = {
  payload: APICreateArticlePayload;
};


export type APIMutationCreateDisambiguationFromTopicArgs = {
  existingTopicContextTopicId: Scalars['String'];
  existingTopicId: Scalars['String'];
};


export type APIMutationCreateLearningGoalArgs = {
  options?: InputMaybe<APICreateLearningGoalOptions>;
  payload: APICreateLearningGoalPayload;
};


export type APIMutationCreateLearningPathArgs = {
  payload: APICreateLearningPathPayload;
};


export type APIMutationCreateResourceArgs = {
  options?: InputMaybe<APICreateResourceOptions>;
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


export type APIMutationDetachTopicIsPartOfTopicArgs = {
  partOfTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
};


export type APIMutationDetachTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  subTopicId: Scalars['String'];
};


export type APIMutationDownvoteLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
};


export type APIMutationEditCommentArgs = {
  commentId: Scalars['String'];
  payload: APIEditCommentPayload;
};


export type APIMutationHideLearningGoalFromTopicArgs = {
  learningGoalId: Scalars['String'];
  topicId: Scalars['String'];
};


export type APIMutationHideLearningMaterialFromTopicArgs = {
  learningMaterialId: Scalars['String'];
  topicId: Scalars['String'];
};


export type APIMutationIndexLearningGoalArgs = {
  learningGoalId: Scalars['String'];
};


export type APIMutationLoginArgs = {
  discourseSSO?: InputMaybe<APIDiscourseSso>;
  email: Scalars['String'];
  password: Scalars['String'];
};


export type APIMutationLoginGoogleArgs = {
  discourseSSO?: InputMaybe<APIDiscourseSso>;
  idToken: Scalars['String'];
};


export type APIMutationPostCommentArgs = {
  payload: APIPostCommentPayload;
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
  prerequisiteTopicId: Scalars['String'];
  topicId: Scalars['String'];
};


export type APIMutationRemoveTopicTypesFromTopicArgs = {
  topicId: Scalars['String'];
  topicTypes: Array<Scalars['String']>;
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


export type APIMutationShowLearningGoalInTopicArgs = {
  learningGoalId: Scalars['String'];
  payload: APIShowLearningGoalInTopicPayload;
  topicId: Scalars['String'];
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
  payload: APIUpdateTopicPayload;
  topicId: Scalars['String'];
};


export type APIMutationUpdateTopicContextArgs = {
  contextTopicId: Scalars['String'];
  topicId: Scalars['String'];
};


export type APIMutationUpdateTopicIsPartOfTopicArgs = {
  partOfTopicId: Scalars['String'];
  payload: APIUpdateTopicIsPartOfTopicPayload;
  subTopicId: Scalars['String'];
};


export type APIMutationUpdateTopicIsSubTopicOfTopicArgs = {
  parentTopicId: Scalars['String'];
  payload: APIUpdateTopicIsSubTopicOfTopicPayload;
  subTopicId: Scalars['String'];
};


export type APIMutationUpdateTopicTopicTypesArgs = {
  topicId: Scalars['String'];
  topicTypesNames: Array<Scalars['String']>;
};


export type APIMutationVerifyEmailAddressArgs = {
  token: Scalars['String'];
};

export type APIPaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type APIPostCommentPayload = {
  contentMarkdown: Scalars['String'];
  discussionId: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
};

export enum APIPrereqParentsPathStopCondition {
  CommonParent = 'common_parent'
}

export type APIPullDescriptionsQueryOptions = {
  aliases?: InputMaybe<Array<Scalars['String']>>;
  contextName?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parentTopicName?: InputMaybe<Scalars['String']>;
};

export type APIPulledDescription = {
  __typename?: 'PulledDescription';
  description: Scalars['String'];
  resultName?: Maybe<Scalars['String']>;
  sourceName: PulledDescriptionSourceName;
  sourceUrl: Scalars['String'];
};

export { PulledDescriptionSourceName };

export type APIQuery = {
  __typename?: 'Query';
  analyzeResourceUrl: APIAnalyzeResourceUrlResult;
  autocompleteTopicName: APISearchTopicsResult;
  checkLearningGoalKeyAvailability: APICheckLearningGoalKeyAvailabilityResult;
  checkTopicKeyAvailability: APICheckTopicKeyAvailabilityResult;
  checkUserKeyAvailability: APICheckUserKeyAvailabilityResult;
  currentUser?: Maybe<APICurrentUser>;
  getArticleByKey: APIArticle;
  getCommentById: APIComment;
  getHomePageData: APIGetHomePageDataResults;
  getLearningGoalByKey: APILearningGoal;
  getLearningPathById: APILearningPath;
  getLearningPathByKey: APILearningPath;
  getResourceById: APIResource;
  getResourceByKey: APIResource;
  getTopLevelTopics: APIGetTopLevelTopicsResults;
  getTopicById: APITopic;
  getTopicByKey: APITopic;
  getTopicValidContexts: APIGetTopicValidContextsResult;
  getTopicValidContextsFromDisambiguation: APIGetTopicValidContextsFromDisambiguation;
  getTopicValidContextsFromSameName: APIGetTopicValidContextsFromSameName;
  getUser: APIUser;
  globalSearch: APIGlobalSearchResults;
  listArticles: APIListArticlesResult;
  pullTopicDescriptions: Array<APIPulledDescription>;
  searchLearningGoals: APISearchLearningGoalsResult;
  searchLearningMaterialTags: Array<APILearningMaterialTagSearchResult>;
  searchResources: APISearchResourcesResult;
  searchSubTopics: APISearchTopicsResult;
  searchTopicTypes: Array<APITopicType>;
  searchTopics: APISearchTopicsResult;
};


export type APIQueryAnalyzeResourceUrlArgs = {
  url: Scalars['String'];
};


export type APIQueryAutocompleteTopicNameArgs = {
  partialName: Scalars['String'];
};


export type APIQueryCheckLearningGoalKeyAvailabilityArgs = {
  key: Scalars['String'];
};


export type APIQueryCheckTopicKeyAvailabilityArgs = {
  key: Scalars['String'];
};


export type APIQueryCheckUserKeyAvailabilityArgs = {
  key: Scalars['String'];
};


export type APIQueryGetArticleByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetCommentByIdArgs = {
  commentId: Scalars['String'];
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


export type APIQueryGetTopicValidContextsArgs = {
  parentTopicId: Scalars['String'];
  topicId: Scalars['String'];
};


export type APIQueryGetTopicValidContextsFromDisambiguationArgs = {
  disambiguationTopicId: Scalars['String'];
  parentTopicId: Scalars['String'];
};


export type APIQueryGetTopicValidContextsFromSameNameArgs = {
  existingSameNameTopicId: Scalars['String'];
  parentTopicId: Scalars['String'];
};


export type APIQueryGetUserArgs = {
  key: Scalars['String'];
};


export type APIQueryGlobalSearchArgs = {
  options?: InputMaybe<APIGlobalSearchOptions>;
  query: Scalars['String'];
};


export type APIQueryListArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APIQueryPullTopicDescriptionsArgs = {
  queryOptions: APIPullDescriptionsQueryOptions;
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
  topicIds: Array<Scalars['String']>;
};


export type APIQuerySearchTopicTypesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  query: Scalars['String'];
};


export type APIQuerySearchTopicsArgs = {
  options: APISearchTopicsOptions;
};

export type APIRegisterGooglePayload = {
  displayName: Scalars['String'];
  idToken: Scalars['String'];
  key: Scalars['String'];
  subscribeToNewsletter?: InputMaybe<Scalars['Boolean']>;
};

export type APIRegisterPayload = {
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  password: Scalars['String'];
  subscribeToNewsletter?: InputMaybe<Scalars['Boolean']>;
};

export type APIRemoveTopicHasPrerequisiteTopicResult = {
  __typename?: 'RemoveTopicHasPrerequisiteTopicResult';
  prerequisiteTopic: APITopic;
  topic: APITopic;
};

export type APIRequiredInGoalItem = {
  __typename?: 'RequiredInGoalItem';
  goal: APILearningGoal;
  strength: Scalars['Float'];
};

export type APIResetPasswordPayload = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type APIResetPasswordResponse = {
  __typename?: 'ResetPasswordResponse';
  currentUser: APICurrentUser;
};

export type APIResource = APILearningMaterial & {
  __typename?: 'Resource';
  _id: Scalars['String'];
  comments?: Maybe<APICommentResults>;
  consumed?: Maybe<APIConsumedResource>;
  coveredSubTopics?: Maybe<APILearningMaterialCoveredSubTopicsResults>;
  coveredSubTopicsTree?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  key: Scalars['String'];
  name: Scalars['String'];
  nextResource?: Maybe<APIResource>;
  parentResources?: Maybe<Array<APIResource>>;
  prerequisites?: Maybe<Array<APILearningMaterialHasPrerequisiteTopic>>;
  previousResource?: Maybe<APIResource>;
  rating?: Maybe<Scalars['Float']>;
  recommendationsCount?: Maybe<Scalars['Int']>;
  recommended?: Maybe<APILearningMaterialRecommended>;
  recommendedBy?: Maybe<Array<APIUserRecommendedLearningMaterial>>;
  seriesParentResource?: Maybe<APIResource>;
  showedIn?: Maybe<Array<APITopic>>;
  subResourceSeries?: Maybe<Array<APIResource>>;
  subResources?: Maybe<Array<APIResource>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
  types: Array<ResourceType>;
  url: Scalars['String'];
};


export type APIResourceCommentsArgs = {
  options: APICommentOptions;
};


export type APIResourceCoveredSubTopicsArgs = {
  options: APILearningMaterialCoveredSubTopicsOptions;
};


export type APIResourceRecommendedByArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type APIResourceData = {
  __typename?: 'ResourceData';
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  subResourceSeries?: Maybe<Array<APISubResourceExtractedData>>;
  types?: Maybe<Array<ResourceType>>;
};

export { ResourceType };

export type APISearchLearningGoalsOptions = {
  pagination: APIPaginationOptions;
  query?: InputMaybe<Scalars['String']>;
};

export type APISearchLearningGoalsResult = {
  __typename?: 'SearchLearningGoalsResult';
  items: Array<APILearningGoal>;
};

export type APISearchLearningMaterialTagsOptions = {
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APISearchResourcesOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APISearchResourcesResult = {
  __typename?: 'SearchResourcesResult';
  items: Array<APIResource>;
};

export type APISearchResult = {
  __typename?: 'SearchResult';
  entity: APISearchResultEntity;
  score: Scalars['Float'];
};

export type APISearchResultEntity = APILearningPath | APIResource | APITopic;

export type APISearchTopicsOptions = {
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APISearchTopicsResult = {
  __typename?: 'SearchTopicsResult';
  items: Array<APITopic>;
};

export type APISetResourcesConsumedPayload = {
  resources: Array<APISetResourcesConsumedPayloadResourcesField>;
};

export type APISetResourcesConsumedPayloadResourcesField = {
  consumed?: InputMaybe<Scalars['Boolean']>;
  opened?: InputMaybe<Scalars['Boolean']>;
  resourceId: Scalars['String'];
};

export type APISetTopicKnownPayloadTopicsField = {
  level?: InputMaybe<Scalars['Float']>;
  topicId: Scalars['String'];
};

export type APISetTopicsKnownPayload = {
  topics: Array<APISetTopicKnownPayloadTopicsField>;
};

export type APIShowLearningGoalInTopicPayload = {
  index?: InputMaybe<Scalars['Float']>;
};

export type APIShowLearningGoalInTopicResult = {
  __typename?: 'ShowLearningGoalInTopicResult';
  learningGoal: APILearningGoal;
  topic: APITopic;
};

export enum APISortingDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type APISubGoal = APILearningGoal | APITopic;

export type APISubGoalItem = {
  __typename?: 'SubGoalItem';
  strength: Scalars['Float'];
  subGoal: APISubGoal;
};

export type APISubResourceCreatedResult = {
  __typename?: 'SubResourceCreatedResult';
  parentResource: APIResource;
  subResource: APIResource;
};

export type APISubResourceExtractedData = {
  __typename?: 'SubResourceExtractedData';
  description?: Maybe<Scalars['String']>;
  durationSeconds?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  types: Array<ResourceType>;
  url: Scalars['String'];
};

export type APISubResourceSeriesCreatedResult = {
  __typename?: 'SubResourceSeriesCreatedResult';
  seriesParentResource: APIResource;
  subResource: APIResource;
};

export { SubTopicRelationshipType };

export type APITagFilter = {
  __typename?: 'TagFilter';
  count: Scalars['Int'];
  name: Scalars['String'];
};

export type APITopic = {
  __typename?: 'Topic';
  _id: Scalars['String'];
  aggregatedSubtopicsPrerequisites?: Maybe<Array<APIAggregatedSubtopicPrerequisite>>;
  aliases?: Maybe<Array<Scalars['String']>>;
  comments?: Maybe<APICommentResults>;
  context?: Maybe<Scalars['String']>;
  contextTopic?: Maybe<APITopic>;
  contextualisedTopics?: Maybe<Array<APITopic>>;
  createdAt: Scalars['Date'];
  createdBy?: Maybe<APIUser>;
  description?: Maybe<Scalars['String']>;
  descriptionSourceUrl?: Maybe<Scalars['String']>;
  disambiguationTopic?: Maybe<APITopic>;
  followUps?: Maybe<Array<APITopicHasPrerequisiteTopic>>;
  isDisambiguation?: Maybe<Scalars['Boolean']>;
  key: Scalars['String'];
  learningMaterials?: Maybe<APITopicLearningMaterialsResults>;
  learningMaterialsAvailableTypeFilters?: Maybe<APITopicLearningMaterialsAvailableTypeFilters>;
  learningMaterialsTotalCount?: Maybe<Scalars['Int']>;
  level?: Maybe<Scalars['Float']>;
  managePageComments?: Maybe<APICommentResults>;
  name: Scalars['String'];
  otherContextsTopics?: Maybe<Array<APITopic>>;
  parentTopic?: Maybe<APITopic>;
  partOfTopics?: Maybe<Array<APITopicIsPartOfTopic>>;
  prerequisites?: Maybe<Array<APITopicHasPrerequisiteTopic>>;
  subTopics?: Maybe<Array<APITopicIsSubTopicOfTopic>>;
  subTopicsTotalCount?: Maybe<Scalars['Int']>;
  topicTypes?: Maybe<Array<APITopicType>>;
  wikipediaPageUrl?: Maybe<Scalars['String']>;
};


export type APITopicAggregatedSubtopicsPrerequisitesArgs = {
  options: APIAggregatedSubtopicsPrerequisitesOptions;
};


export type APITopicCommentsArgs = {
  options: APICommentOptions;
};


export type APITopicLearningMaterialsArgs = {
  options: APITopicLearningMaterialsOptions;
};


export type APITopicManagePageCommentsArgs = {
  options: APICommentOptions;
};


export type APITopicSubTopicsArgs = {
  options?: InputMaybe<APITopicSubTopicsOptions>;
};

export type APITopicHasPrerequisiteTopic = {
  __typename?: 'TopicHasPrerequisiteTopic';
  followUpTopic: APITopic;
  prerequisiteTopic: APITopic;
  strength: Scalars['Float'];
};

export type APITopicIsPartOfTopic = {
  __typename?: 'TopicIsPartOfTopic';
  createdAt: Scalars['Date'];
  createdByUserId?: Maybe<Scalars['String']>;
  index: Scalars['Float'];
  partOfTopic: APITopic;
  subTopic: APITopic;
};

export type APITopicIsSubTopicOfTopic = {
  __typename?: 'TopicIsSubTopicOfTopic';
  createdAt: Scalars['Date'];
  createdByUserId?: Maybe<Scalars['String']>;
  index: Scalars['Float'];
  parentTopic: APITopic;
  relationshipType: SubTopicRelationshipType;
  subTopic: APITopic;
};

export type APITopicLearningMaterialsAvailableTypeFilters = {
  __typename?: 'TopicLearningMaterialsAvailableTypeFilters';
  geq30minCount: Scalars['Int'];
  learningPathsCount: Scalars['Int'];
  leq30minCount: Scalars['Int'];
  types: Array<ResourceType>;
};

export type APITopicLearningMaterialsFilterOptions = {
  completedByUser?: InputMaybe<Scalars['Boolean']>;
  durationSecondsGeq?: InputMaybe<Scalars['Int']>;
  durationSecondsLeq?: InputMaybe<Scalars['Int']>;
  learningMaterialTagsIn?: InputMaybe<Array<Scalars['String']>>;
  learningMaterialTypeIn?: InputMaybe<Array<APILearningMaterialType>>;
  resourceTypeIn?: InputMaybe<Array<ResourceType>>;
};

export type APITopicLearningMaterialsOptions = {
  filter: APITopicLearningMaterialsFilterOptions;
  pagination?: InputMaybe<APIPaginationOptions>;
  query?: InputMaybe<Scalars['String']>;
  sortingType: APITopicLearningMaterialsSortingType;
};

export type APITopicLearningMaterialsResults = {
  __typename?: 'TopicLearningMaterialsResults';
  availableTagFilters: Array<APITagFilter>;
  items: Array<APILearningMaterial>;
  totalCount: Scalars['Int'];
};

export enum APITopicLearningMaterialsSortingType {
  MostRecommended = 'most_recommended',
  Newest = 'newest'
}

export type APITopicSubTopicsFilterOptions = {
  currentTopicTypesNotIn?: InputMaybe<Array<Scalars['String']>>;
};

export type APITopicSubTopicsOptions = {
  filter?: InputMaybe<APITopicSubTopicsFilterOptions>;
};

export type APITopicType = {
  __typename?: 'TopicType';
  color?: Maybe<TopicTypeColor>;
  iconName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  usageCount?: Maybe<Scalars['Int']>;
};

export { TopicTypeColor };

export type APITriggerResetPasswordResponse = {
  __typename?: 'TriggerResetPasswordResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type APIUpdateArticlePayload = {
  content?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type APIUpdateCurrentUserPayload = {
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  profilePictureUrl?: InputMaybe<Scalars['String']>;
};

export type APIUpdateLearningGoalDependenciesResult = {
  __typename?: 'UpdateLearningGoalDependenciesResult';
  learningGoal: APILearningGoal;
  learningGoalDependency: APILearningGoal;
  parentLearningGoal: APILearningGoal;
};

export type APIUpdateLearningGoalPayload = {
  description?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LearningGoalType>;
};

export type APIUpdateLearningPathPayload = {
  description?: InputMaybe<Scalars['String']>;
  durationSeconds?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  outro?: InputMaybe<Scalars['String']>;
  public?: InputMaybe<Scalars['Boolean']>;
  resourceItems?: InputMaybe<Array<APICreateLearningPathResourceItem>>;
};

export type APIUpdateResourcePayload = {
  description?: InputMaybe<Scalars['String']>;
  durationSeconds?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  types?: InputMaybe<Array<ResourceType>>;
  url?: InputMaybe<Scalars['String']>;
};

export type APIUpdateTopicIsPartOfTopicPayload = {
  index?: InputMaybe<Scalars['Float']>;
};

export type APIUpdateTopicIsSubTopicOfTopicPayload = {
  index?: InputMaybe<Scalars['Float']>;
};

export type APIUpdateTopicPayload = {
  aliases?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  descriptionSourceUrl?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  wikipediaPageUrl?: InputMaybe<Scalars['String']>;
};

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

export type APIUserConsumedResourceItem = {
  __typename?: 'UserConsumedResourceItem';
  consumedAt?: Maybe<Scalars['Date']>;
  lastOpenedAt?: Maybe<Scalars['Date']>;
  openedAt?: Maybe<Scalars['Date']>;
  resource: APIResource;
};

export type APIUserConsumedResourcesFilter = {
  completed?: InputMaybe<Scalars['Boolean']>;
};

export type APIUserConsumedResourcesOptions = {
  filter?: InputMaybe<APIUserConsumedResourcesFilter>;
  pagination?: InputMaybe<APIPaginationOptions>;
  sorting: APIUserConsumedResourcesSortingType;
};

export type APIUserConsumedResourcesResult = {
  __typename?: 'UserConsumedResourcesResult';
  count: Scalars['Int'];
  items: Array<APIUserConsumedResourceItem>;
};

export enum APIUserConsumedResourcesSortingType {
  LastOpened = 'lastOpened'
}

export type APIUserLearningPathsOptions = {
  pagination?: InputMaybe<APIPaginationOptions>;
};

export type APIUserRecommendedLearningMaterial = {
  __typename?: 'UserRecommendedLearningMaterial';
  learningMaterial: APILearningMaterial;
  recommendedAt: Scalars['Date'];
  user: APIUser;
};

export { UserRole };

export type APIVerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  email: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  AddTopicHasPrerequisiteTopicResult: ResolverTypeWrapper<APIAddTopicHasPrerequisiteTopicResult>;
  AdminUpdateUserPayload: APIAdminUpdateUserPayload;
  AggregatedSubtopicPrerequisite: ResolverTypeWrapper<APIAggregatedSubtopicPrerequisite>;
  AggregatedSubtopicsPrerequisitesOptions: APIAggregatedSubtopicsPrerequisitesOptions;
  AnalyzeResourceUrlResult: ResolverTypeWrapper<APIAnalyzeResourceUrlResult>;
  Article: ResolverTypeWrapper<APIArticle>;
  ArticleContentType: ArticleContentType;
  AttachLearningGoalRequiresSubGoalPayload: APIAttachLearningGoalRequiresSubGoalPayload;
  AttachLearningGoalRequiresSubGoalResult: ResolverTypeWrapper<Omit<APIAttachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>;
  AttachTopicIsPartOfTopicPayload: APIAttachTopicIsPartOfTopicPayload;
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CheckLearningGoalKeyAvailabilityResult: ResolverTypeWrapper<APICheckLearningGoalKeyAvailabilityResult>;
  CheckTopicKeyAvailabilityResult: ResolverTypeWrapper<APICheckTopicKeyAvailabilityResult>;
  CheckUserKeyAvailabilityResult: ResolverTypeWrapper<APICheckUserKeyAvailabilityResult>;
  Comment: ResolverTypeWrapper<APIComment>;
  CommentOptions: APICommentOptions;
  CommentResults: ResolverTypeWrapper<APICommentResults>;
  ComplementaryResourceUpdatedResult: ResolverTypeWrapper<APIComplementaryResourceUpdatedResult>;
  ConsumedResource: ResolverTypeWrapper<APIConsumedResource>;
  CreateArticlePayload: APICreateArticlePayload;
  CreateLearningGoalOptions: APICreateLearningGoalOptions;
  CreateLearningGoalPayload: APICreateLearningGoalPayload;
  CreateLearningPathPayload: APICreateLearningPathPayload;
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem;
  CreateResourceOptions: APICreateResourceOptions;
  CreateResourcePayload: APICreateResourcePayload;
  CreateSubResourcePayload: APICreateSubResourcePayload;
  CreateTopicContextOptions: APICreateTopicContextOptions;
  CreateTopicPayload: APICreateTopicPayload;
  CurrentUser: ResolverTypeWrapper<APICurrentUser>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DeleteArticleResponse: ResolverTypeWrapper<APIDeleteArticleResponse>;
  DeleteLearningGoalMutationResult: ResolverTypeWrapper<APIDeleteLearningGoalMutationResult>;
  DeleteLearningPathResult: ResolverTypeWrapper<APIDeleteLearningPathResult>;
  DeleteResourceResponse: ResolverTypeWrapper<APIDeleteResourceResponse>;
  DeleteTopicResponse: ResolverTypeWrapper<APIDeleteTopicResponse>;
  DependsOnGoalItem: ResolverTypeWrapper<APIDependsOnGoalItem>;
  DetachLearningGoalRequiresSubGoalResult: ResolverTypeWrapper<Omit<APIDetachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>;
  DetachTopicIsPartOfTopicResult: ResolverTypeWrapper<APIDetachTopicIsPartOfTopicResult>;
  DetachTopicIsSubTopicOfTopicResult: ResolverTypeWrapper<APIDetachTopicIsSubTopicOfTopicResult>;
  DiscourseSSO: APIDiscourseSso;
  DiscussionLocation: APIDiscussionLocation;
  EditCommentPayload: APIEditCommentPayload;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  GetHomePageDataResults: ResolverTypeWrapper<APIGetHomePageDataResults>;
  GetTopLevelTopicsResults: ResolverTypeWrapper<APIGetTopLevelTopicsResults>;
  GetTopicValidContextsFromDisambiguation: ResolverTypeWrapper<APIGetTopicValidContextsFromDisambiguation>;
  GetTopicValidContextsFromSameName: ResolverTypeWrapper<APIGetTopicValidContextsFromSameName>;
  GetTopicValidContextsResult: ResolverTypeWrapper<APIGetTopicValidContextsResult>;
  GlobalSearchOptions: APIGlobalSearchOptions;
  GlobalSearchResults: ResolverTypeWrapper<APIGlobalSearchResults>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  KnownTopic: ResolverTypeWrapper<APIKnownTopic>;
  LearningGoal: ResolverTypeWrapper<APILearningGoal>;
  LearningGoalIndexedResult: ResolverTypeWrapper<APILearningGoalIndexedResult>;
  LearningGoalProgress: ResolverTypeWrapper<APILearningGoalProgress>;
  LearningGoalPublishedResult: ResolverTypeWrapper<APILearningGoalPublishedResult>;
  LearningGoalRelevantLearningMaterialsItem: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsItem>;
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions;
  LearningGoalRelevantLearningMaterialsResults: ResolverTypeWrapper<APILearningGoalRelevantLearningMaterialsResults>;
  LearningGoalStarted: ResolverTypeWrapper<APILearningGoalStarted>;
  LearningGoalStartedByItem: ResolverTypeWrapper<APILearningGoalStartedByItem>;
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions;
  LearningGoalStartedByResults: ResolverTypeWrapper<APILearningGoalStartedByResults>;
  LearningGoalStartedResult: ResolverTypeWrapper<APILearningGoalStartedResult>;
  LearningGoalType: LearningGoalType;
  LearningMaterial: APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'];
  LearningMaterialCoveredSubTopicsOptions: APILearningMaterialCoveredSubTopicsOptions;
  LearningMaterialCoveredSubTopicsResults: ResolverTypeWrapper<APILearningMaterialCoveredSubTopicsResults>;
  LearningMaterialCoversTopic: ResolverTypeWrapper<APILearningMaterialCoversTopic>;
  LearningMaterialHasPrerequisiteTopic: ResolverTypeWrapper<APILearningMaterialHasPrerequisiteTopic>;
  LearningMaterialRecommended: ResolverTypeWrapper<APILearningMaterialRecommended>;
  LearningMaterialTag: ResolverTypeWrapper<APILearningMaterialTag>;
  LearningMaterialTagSearchResult: ResolverTypeWrapper<APILearningMaterialTagSearchResult>;
  LearningMaterialType: APILearningMaterialType;
  LearningPath: ResolverTypeWrapper<APILearningPath>;
  LearningPathCompletedResult: ResolverTypeWrapper<APILearningPathCompletedResult>;
  LearningPathResourceItem: ResolverTypeWrapper<APILearningPathResourceItem>;
  LearningPathStarted: ResolverTypeWrapper<APILearningPathStarted>;
  LearningPathStartedByItem: ResolverTypeWrapper<APILearningPathStartedByItem>;
  LearningPathStartedByOptions: APILearningPathStartedByOptions;
  LearningPathStartedByResults: ResolverTypeWrapper<APILearningPathStartedByResults>;
  LearningPathStartedItem: ResolverTypeWrapper<APILearningPathStartedItem>;
  LearningPathStartedResult: ResolverTypeWrapper<APILearningPathStartedResult>;
  ListArticlesFilter: APIListArticlesFilter;
  ListArticlesOptions: APIListArticlesOptions;
  ListArticlesResult: ResolverTypeWrapper<APIListArticlesResult>;
  LoginResponse: ResolverTypeWrapper<APILoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationOptions: APIPaginationOptions;
  PostCommentPayload: APIPostCommentPayload;
  PrereqParentsPathStopCondition: APIPrereqParentsPathStopCondition;
  PullDescriptionsQueryOptions: APIPullDescriptionsQueryOptions;
  PulledDescription: ResolverTypeWrapper<APIPulledDescription>;
  PulledDescriptionSourceName: PulledDescriptionSourceName;
  Query: ResolverTypeWrapper<{}>;
  RegisterGooglePayload: APIRegisterGooglePayload;
  RegisterPayload: APIRegisterPayload;
  RemoveTopicHasPrerequisiteTopicResult: ResolverTypeWrapper<APIRemoveTopicHasPrerequisiteTopicResult>;
  RequiredInGoalItem: ResolverTypeWrapper<APIRequiredInGoalItem>;
  ResetPasswordPayload: APIResetPasswordPayload;
  ResetPasswordResponse: ResolverTypeWrapper<APIResetPasswordResponse>;
  Resource: ResolverTypeWrapper<APIResource>;
  ResourceData: ResolverTypeWrapper<APIResourceData>;
  ResourceType: ResourceType;
  SearchLearningGoalsOptions: APISearchLearningGoalsOptions;
  SearchLearningGoalsResult: ResolverTypeWrapper<APISearchLearningGoalsResult>;
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions;
  SearchResourcesOptions: APISearchResourcesOptions;
  SearchResourcesResult: ResolverTypeWrapper<APISearchResourcesResult>;
  SearchResult: ResolverTypeWrapper<Omit<APISearchResult, 'entity'> & { entity: APIResolversTypes['SearchResultEntity'] }>;
  SearchResultEntity: APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'] | APIResolversTypes['Topic'];
  SearchTopicsOptions: APISearchTopicsOptions;
  SearchTopicsResult: ResolverTypeWrapper<APISearchTopicsResult>;
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload;
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField;
  SetTopicKnownPayloadTopicsField: APISetTopicKnownPayloadTopicsField;
  SetTopicsKnownPayload: APISetTopicsKnownPayload;
  ShowLearningGoalInTopicPayload: APIShowLearningGoalInTopicPayload;
  ShowLearningGoalInTopicResult: ResolverTypeWrapper<APIShowLearningGoalInTopicResult>;
  SortingDirection: APISortingDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubGoal: APIResolversTypes['LearningGoal'] | APIResolversTypes['Topic'];
  SubGoalItem: ResolverTypeWrapper<Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversTypes['SubGoal'] }>;
  SubResourceCreatedResult: ResolverTypeWrapper<APISubResourceCreatedResult>;
  SubResourceExtractedData: ResolverTypeWrapper<APISubResourceExtractedData>;
  SubResourceSeriesCreatedResult: ResolverTypeWrapper<APISubResourceSeriesCreatedResult>;
  SubTopicRelationshipType: SubTopicRelationshipType;
  TagFilter: ResolverTypeWrapper<APITagFilter>;
  Topic: ResolverTypeWrapper<APITopic>;
  TopicHasPrerequisiteTopic: ResolverTypeWrapper<APITopicHasPrerequisiteTopic>;
  TopicIsPartOfTopic: ResolverTypeWrapper<APITopicIsPartOfTopic>;
  TopicIsSubTopicOfTopic: ResolverTypeWrapper<APITopicIsSubTopicOfTopic>;
  TopicLearningMaterialsAvailableTypeFilters: ResolverTypeWrapper<APITopicLearningMaterialsAvailableTypeFilters>;
  TopicLearningMaterialsFilterOptions: APITopicLearningMaterialsFilterOptions;
  TopicLearningMaterialsOptions: APITopicLearningMaterialsOptions;
  TopicLearningMaterialsResults: ResolverTypeWrapper<APITopicLearningMaterialsResults>;
  TopicLearningMaterialsSortingType: APITopicLearningMaterialsSortingType;
  TopicSubTopicsFilterOptions: APITopicSubTopicsFilterOptions;
  TopicSubTopicsOptions: APITopicSubTopicsOptions;
  TopicType: ResolverTypeWrapper<APITopicType>;
  TopicTypeColor: TopicTypeColor;
  TriggerResetPasswordResponse: ResolverTypeWrapper<APITriggerResetPasswordResponse>;
  UpdateArticlePayload: APIUpdateArticlePayload;
  UpdateCurrentUserPayload: APIUpdateCurrentUserPayload;
  UpdateLearningGoalDependenciesResult: ResolverTypeWrapper<APIUpdateLearningGoalDependenciesResult>;
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload;
  UpdateLearningPathPayload: APIUpdateLearningPathPayload;
  UpdateResourcePayload: APIUpdateResourcePayload;
  UpdateTopicIsPartOfTopicPayload: APIUpdateTopicIsPartOfTopicPayload;
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload;
  UpdateTopicPayload: APIUpdateTopicPayload;
  User: ResolverTypeWrapper<APIUser>;
  UserConsumedResourceItem: ResolverTypeWrapper<APIUserConsumedResourceItem>;
  UserConsumedResourcesFilter: APIUserConsumedResourcesFilter;
  UserConsumedResourcesOptions: APIUserConsumedResourcesOptions;
  UserConsumedResourcesResult: ResolverTypeWrapper<APIUserConsumedResourcesResult>;
  UserConsumedResourcesSortingType: APIUserConsumedResourcesSortingType;
  UserLearningPathsOptions: APIUserLearningPathsOptions;
  UserRecommendedLearningMaterial: ResolverTypeWrapper<APIUserRecommendedLearningMaterial>;
  UserRole: UserRole;
  VerifyEmailResponse: ResolverTypeWrapper<APIVerifyEmailResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type APIResolversParentTypes = ResolversObject<{
  AddTopicHasPrerequisiteTopicResult: APIAddTopicHasPrerequisiteTopicResult;
  AdminUpdateUserPayload: APIAdminUpdateUserPayload;
  AggregatedSubtopicPrerequisite: APIAggregatedSubtopicPrerequisite;
  AggregatedSubtopicsPrerequisitesOptions: APIAggregatedSubtopicsPrerequisitesOptions;
  AnalyzeResourceUrlResult: APIAnalyzeResourceUrlResult;
  Article: APIArticle;
  AttachLearningGoalRequiresSubGoalPayload: APIAttachLearningGoalRequiresSubGoalPayload;
  AttachLearningGoalRequiresSubGoalResult: Omit<APIAttachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] };
  AttachTopicIsPartOfTopicPayload: APIAttachTopicIsPartOfTopicPayload;
  AttachTopicIsSubTopicOfTopicPayload: APIAttachTopicIsSubTopicOfTopicPayload;
  Boolean: Scalars['Boolean'];
  CheckLearningGoalKeyAvailabilityResult: APICheckLearningGoalKeyAvailabilityResult;
  CheckTopicKeyAvailabilityResult: APICheckTopicKeyAvailabilityResult;
  CheckUserKeyAvailabilityResult: APICheckUserKeyAvailabilityResult;
  Comment: APIComment;
  CommentOptions: APICommentOptions;
  CommentResults: APICommentResults;
  ComplementaryResourceUpdatedResult: APIComplementaryResourceUpdatedResult;
  ConsumedResource: APIConsumedResource;
  CreateArticlePayload: APICreateArticlePayload;
  CreateLearningGoalOptions: APICreateLearningGoalOptions;
  CreateLearningGoalPayload: APICreateLearningGoalPayload;
  CreateLearningPathPayload: APICreateLearningPathPayload;
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem;
  CreateResourceOptions: APICreateResourceOptions;
  CreateResourcePayload: APICreateResourcePayload;
  CreateSubResourcePayload: APICreateSubResourcePayload;
  CreateTopicContextOptions: APICreateTopicContextOptions;
  CreateTopicPayload: APICreateTopicPayload;
  CurrentUser: APICurrentUser;
  Date: Scalars['Date'];
  DeleteArticleResponse: APIDeleteArticleResponse;
  DeleteLearningGoalMutationResult: APIDeleteLearningGoalMutationResult;
  DeleteLearningPathResult: APIDeleteLearningPathResult;
  DeleteResourceResponse: APIDeleteResourceResponse;
  DeleteTopicResponse: APIDeleteTopicResponse;
  DependsOnGoalItem: APIDependsOnGoalItem;
  DetachLearningGoalRequiresSubGoalResult: Omit<APIDetachLearningGoalRequiresSubGoalResult, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] };
  DetachTopicIsPartOfTopicResult: APIDetachTopicIsPartOfTopicResult;
  DetachTopicIsSubTopicOfTopicResult: APIDetachTopicIsSubTopicOfTopicResult;
  DiscourseSSO: APIDiscourseSso;
  EditCommentPayload: APIEditCommentPayload;
  Float: Scalars['Float'];
  GetHomePageDataResults: APIGetHomePageDataResults;
  GetTopLevelTopicsResults: APIGetTopLevelTopicsResults;
  GetTopicValidContextsFromDisambiguation: APIGetTopicValidContextsFromDisambiguation;
  GetTopicValidContextsFromSameName: APIGetTopicValidContextsFromSameName;
  GetTopicValidContextsResult: APIGetTopicValidContextsResult;
  GlobalSearchOptions: APIGlobalSearchOptions;
  GlobalSearchResults: APIGlobalSearchResults;
  Int: Scalars['Int'];
  KnownTopic: APIKnownTopic;
  LearningGoal: APILearningGoal;
  LearningGoalIndexedResult: APILearningGoalIndexedResult;
  LearningGoalProgress: APILearningGoalProgress;
  LearningGoalPublishedResult: APILearningGoalPublishedResult;
  LearningGoalRelevantLearningMaterialsItem: APILearningGoalRelevantLearningMaterialsItem;
  LearningGoalRelevantLearningMaterialsOptions: APILearningGoalRelevantLearningMaterialsOptions;
  LearningGoalRelevantLearningMaterialsResults: APILearningGoalRelevantLearningMaterialsResults;
  LearningGoalStarted: APILearningGoalStarted;
  LearningGoalStartedByItem: APILearningGoalStartedByItem;
  LearningGoalStartedByOptions: APILearningGoalStartedByOptions;
  LearningGoalStartedByResults: APILearningGoalStartedByResults;
  LearningGoalStartedResult: APILearningGoalStartedResult;
  LearningMaterial: APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'];
  LearningMaterialCoveredSubTopicsOptions: APILearningMaterialCoveredSubTopicsOptions;
  LearningMaterialCoveredSubTopicsResults: APILearningMaterialCoveredSubTopicsResults;
  LearningMaterialCoversTopic: APILearningMaterialCoversTopic;
  LearningMaterialHasPrerequisiteTopic: APILearningMaterialHasPrerequisiteTopic;
  LearningMaterialRecommended: APILearningMaterialRecommended;
  LearningMaterialTag: APILearningMaterialTag;
  LearningMaterialTagSearchResult: APILearningMaterialTagSearchResult;
  LearningPath: APILearningPath;
  LearningPathCompletedResult: APILearningPathCompletedResult;
  LearningPathResourceItem: APILearningPathResourceItem;
  LearningPathStarted: APILearningPathStarted;
  LearningPathStartedByItem: APILearningPathStartedByItem;
  LearningPathStartedByOptions: APILearningPathStartedByOptions;
  LearningPathStartedByResults: APILearningPathStartedByResults;
  LearningPathStartedItem: APILearningPathStartedItem;
  LearningPathStartedResult: APILearningPathStartedResult;
  ListArticlesFilter: APIListArticlesFilter;
  ListArticlesOptions: APIListArticlesOptions;
  ListArticlesResult: APIListArticlesResult;
  LoginResponse: APILoginResponse;
  Mutation: {};
  PaginationOptions: APIPaginationOptions;
  PostCommentPayload: APIPostCommentPayload;
  PullDescriptionsQueryOptions: APIPullDescriptionsQueryOptions;
  PulledDescription: APIPulledDescription;
  Query: {};
  RegisterGooglePayload: APIRegisterGooglePayload;
  RegisterPayload: APIRegisterPayload;
  RemoveTopicHasPrerequisiteTopicResult: APIRemoveTopicHasPrerequisiteTopicResult;
  RequiredInGoalItem: APIRequiredInGoalItem;
  ResetPasswordPayload: APIResetPasswordPayload;
  ResetPasswordResponse: APIResetPasswordResponse;
  Resource: APIResource;
  ResourceData: APIResourceData;
  SearchLearningGoalsOptions: APISearchLearningGoalsOptions;
  SearchLearningGoalsResult: APISearchLearningGoalsResult;
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions;
  SearchResourcesOptions: APISearchResourcesOptions;
  SearchResourcesResult: APISearchResourcesResult;
  SearchResult: Omit<APISearchResult, 'entity'> & { entity: APIResolversParentTypes['SearchResultEntity'] };
  SearchResultEntity: APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'] | APIResolversParentTypes['Topic'];
  SearchTopicsOptions: APISearchTopicsOptions;
  SearchTopicsResult: APISearchTopicsResult;
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload;
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField;
  SetTopicKnownPayloadTopicsField: APISetTopicKnownPayloadTopicsField;
  SetTopicsKnownPayload: APISetTopicsKnownPayload;
  ShowLearningGoalInTopicPayload: APIShowLearningGoalInTopicPayload;
  ShowLearningGoalInTopicResult: APIShowLearningGoalInTopicResult;
  String: Scalars['String'];
  SubGoal: APIResolversParentTypes['LearningGoal'] | APIResolversParentTypes['Topic'];
  SubGoalItem: Omit<APISubGoalItem, 'subGoal'> & { subGoal: APIResolversParentTypes['SubGoal'] };
  SubResourceCreatedResult: APISubResourceCreatedResult;
  SubResourceExtractedData: APISubResourceExtractedData;
  SubResourceSeriesCreatedResult: APISubResourceSeriesCreatedResult;
  TagFilter: APITagFilter;
  Topic: APITopic;
  TopicHasPrerequisiteTopic: APITopicHasPrerequisiteTopic;
  TopicIsPartOfTopic: APITopicIsPartOfTopic;
  TopicIsSubTopicOfTopic: APITopicIsSubTopicOfTopic;
  TopicLearningMaterialsAvailableTypeFilters: APITopicLearningMaterialsAvailableTypeFilters;
  TopicLearningMaterialsFilterOptions: APITopicLearningMaterialsFilterOptions;
  TopicLearningMaterialsOptions: APITopicLearningMaterialsOptions;
  TopicLearningMaterialsResults: APITopicLearningMaterialsResults;
  TopicSubTopicsFilterOptions: APITopicSubTopicsFilterOptions;
  TopicSubTopicsOptions: APITopicSubTopicsOptions;
  TopicType: APITopicType;
  TriggerResetPasswordResponse: APITriggerResetPasswordResponse;
  UpdateArticlePayload: APIUpdateArticlePayload;
  UpdateCurrentUserPayload: APIUpdateCurrentUserPayload;
  UpdateLearningGoalDependenciesResult: APIUpdateLearningGoalDependenciesResult;
  UpdateLearningGoalPayload: APIUpdateLearningGoalPayload;
  UpdateLearningPathPayload: APIUpdateLearningPathPayload;
  UpdateResourcePayload: APIUpdateResourcePayload;
  UpdateTopicIsPartOfTopicPayload: APIUpdateTopicIsPartOfTopicPayload;
  UpdateTopicIsSubTopicOfTopicPayload: APIUpdateTopicIsSubTopicOfTopicPayload;
  UpdateTopicPayload: APIUpdateTopicPayload;
  User: APIUser;
  UserConsumedResourceItem: APIUserConsumedResourceItem;
  UserConsumedResourcesFilter: APIUserConsumedResourcesFilter;
  UserConsumedResourcesOptions: APIUserConsumedResourcesOptions;
  UserConsumedResourcesResult: APIUserConsumedResourcesResult;
  UserLearningPathsOptions: APIUserLearningPathsOptions;
  UserRecommendedLearningMaterial: APIUserRecommendedLearningMaterial;
  VerifyEmailResponse: APIVerifyEmailResponse;
}>;

export type APIAddTopicHasPrerequisiteTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AddTopicHasPrerequisiteTopicResult'] = APIResolversParentTypes['AddTopicHasPrerequisiteTopicResult']> = ResolversObject<{
  prerequisiteTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIAggregatedSubtopicPrerequisiteResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AggregatedSubtopicPrerequisite'] = APIResolversParentTypes['AggregatedSubtopicPrerequisite']> = ResolversObject<{
  prerequisiteParentsPath?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>;
  relationship?: Resolver<APIResolversTypes['TopicHasPrerequisiteTopic'], ParentType, ContextType>;
  subTopicPath?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIAnalyzeResourceUrlResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AnalyzeResourceUrlResult'] = APIResolversParentTypes['AnalyzeResourceUrlResult']> = ResolversObject<{
  resourceData?: Resolver<Maybe<APIResolversTypes['ResourceData']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIArticleResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Article'] = APIResolversParentTypes['Article']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  contentType?: Resolver<APIResolversTypes['ArticleContentType'], ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIArticleContentTypeResolvers = EnumResolverSignature<{ markdown?: any }, APIResolversTypes['ArticleContentType']>;

export type APIAttachLearningGoalRequiresSubGoalResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['AttachLearningGoalRequiresSubGoalResult'] = APIResolversParentTypes['AttachLearningGoalRequiresSubGoalResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICheckLearningGoalKeyAvailabilityResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CheckLearningGoalKeyAvailabilityResult'] = APIResolversParentTypes['CheckLearningGoalKeyAvailabilityResult']> = ResolversObject<{
  available?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  existingLearningGoal?: Resolver<Maybe<APIResolversTypes['LearningGoal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICheckTopicKeyAvailabilityResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CheckTopicKeyAvailabilityResult'] = APIResolversParentTypes['CheckTopicKeyAvailabilityResult']> = ResolversObject<{
  available?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  existingTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICheckUserKeyAvailabilityResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CheckUserKeyAvailabilityResult'] = APIResolversParentTypes['CheckUserKeyAvailabilityResult']> = ResolversObject<{
  available?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  existingUser?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICommentResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Comment'] = APIResolversParentTypes['Comment']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  children?: Resolver<Maybe<Array<APIResolversTypes['Comment']>>, ParentType, ContextType>;
  childrenCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  contentMarkdown?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  discussionId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  lastUpdatedAt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<APIResolversTypes['Comment']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  postedAt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  postedBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  postedByUserId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICommentResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CommentResults'] = APIResolversParentTypes['CommentResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Comment']>, ParentType, ContextType>;
  rootCommentsTotalCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  totalCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIComplementaryResourceUpdatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ComplementaryResourceUpdatedResult'] = APIResolversParentTypes['ComplementaryResourceUpdatedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>;
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIConsumedResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConsumedResource'] = APIResolversParentTypes['ConsumedResource']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  lastOpenedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  openedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APICurrentUserArticlesArgs, 'options'>>;
  bio?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  consumedResources?: Resolver<Maybe<APIResolversTypes['UserConsumedResourcesResult']>, ParentType, ContextType, RequireFields<APICurrentUserConsumedResourcesArgs, 'options'>>;
  createdLearningPaths?: Resolver<Maybe<Array<APIResolversTypes['LearningPath']>>, ParentType, ContextType, RequireFields<APICurrentUserCreatedLearningPathsArgs, 'options'>>;
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  profilePictureUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>;
  startedLearningPaths?: Resolver<Maybe<Array<APIResolversTypes['LearningPathStartedItem']>>, ParentType, ContextType, RequireFields<APICurrentUserStartedLearningPathsArgs, 'options'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface APIDateScalarConfig extends GraphQLScalarTypeConfig<APIResolversTypes['Date'], any> {
  name: 'Date';
}

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDeleteLearningGoalMutationResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteLearningGoalMutationResult'] = APIResolversParentTypes['DeleteLearningGoalMutationResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDeleteLearningPathResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteLearningPathResult'] = APIResolversParentTypes['DeleteLearningPathResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDeleteResourceResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteResourceResponse'] = APIResolversParentTypes['DeleteResourceResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDeleteTopicResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteTopicResponse'] = APIResolversParentTypes['DeleteTopicResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDependsOnGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DependsOnGoalItem'] = APIResolversParentTypes['DependsOnGoalItem']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  parentLearningGoalId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDetachLearningGoalRequiresSubGoalResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachLearningGoalRequiresSubGoalResult'] = APIResolversParentTypes['DetachLearningGoalRequiresSubGoalResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDetachTopicIsPartOfTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachTopicIsPartOfTopicResult'] = APIResolversParentTypes['DetachTopicIsPartOfTopicResult']> = ResolversObject<{
  partOfTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult'] = APIResolversParentTypes['DetachTopicIsSubTopicOfTopicResult']> = ResolversObject<{
  parentTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGetHomePageDataResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetHomePageDataResults'] = APIResolversParentTypes['GetHomePageDataResults']> = ResolversObject<{
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>;
  recommendedLearningPaths?: Resolver<Array<APIResolversTypes['LearningPath']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGetTopLevelTopicsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopLevelTopicsResults'] = APIResolversParentTypes['GetTopLevelTopicsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGetTopicValidContextsFromDisambiguationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopicValidContextsFromDisambiguation'] = APIResolversParentTypes['GetTopicValidContextsFromDisambiguation']> = ResolversObject<{
  validContexts?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGetTopicValidContextsFromSameNameResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopicValidContextsFromSameName'] = APIResolversParentTypes['GetTopicValidContextsFromSameName']> = ResolversObject<{
  validContexts?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  validSameNameTopicContexts?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGetTopicValidContextsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GetTopicValidContextsResult'] = APIResolversParentTypes['GetTopicValidContextsResult']> = ResolversObject<{
  validContexts?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIGlobalSearchResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['GlobalSearchResults'] = APIResolversParentTypes['GlobalSearchResults']> = ResolversObject<{
  results?: Resolver<Array<APIResolversTypes['SearchResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIKnownTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['KnownTopic'] = APIResolversParentTypes['KnownTopic']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoal'] = APIResolversParentTypes['LearningGoal']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  dependantLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependantLearningGoalsArgs, never>>;
  dependsOnLearningGoals?: Resolver<Maybe<Array<APIResolversTypes['DependsOnGoalItem']>>, ParentType, ContextType, RequireFields<APILearningGoalDependsOnLearningGoalsArgs, never>>;
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  hidden?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<Maybe<APIResolversTypes['LearningGoalProgress']>, ParentType, ContextType>;
  publishedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  relevantLearningMaterials?: Resolver<Maybe<APIResolversTypes['LearningGoalRelevantLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APILearningGoalRelevantLearningMaterialsArgs, 'options'>>;
  requiredInGoals?: Resolver<Maybe<Array<APIResolversTypes['RequiredInGoalItem']>>, ParentType, ContextType>;
  requiredSubGoals?: Resolver<Maybe<Array<APIResolversTypes['SubGoalItem']>>, ParentType, ContextType>;
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  size?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  started?: Resolver<Maybe<APIResolversTypes['LearningGoalStarted']>, ParentType, ContextType>;
  startedBy?: Resolver<Maybe<APIResolversTypes['LearningGoalStartedByResults']>, ParentType, ContextType, RequireFields<APILearningGoalStartedByArgs, 'options'>>;
  type?: Resolver<APIResolversTypes['LearningGoalType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalIndexedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalIndexedResult'] = APIResolversParentTypes['LearningGoalIndexedResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalProgressResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalProgress'] = APIResolversParentTypes['LearningGoalProgress']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalPublishedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalPublishedResult'] = APIResolversParentTypes['LearningGoalPublishedResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalRelevantLearningMaterialsItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalRelevantLearningMaterialsItem'] = APIResolversParentTypes['LearningGoalRelevantLearningMaterialsItem']> = ResolversObject<{
  coverage?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalRelevantLearningMaterialsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalRelevantLearningMaterialsResults'] = APIResolversParentTypes['LearningGoalRelevantLearningMaterialsResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<APIResolversTypes['LearningGoalRelevantLearningMaterialsItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalStartedResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStarted'] = APIResolversParentTypes['LearningGoalStarted']> = ResolversObject<{
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalStartedByItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedByItem'] = APIResolversParentTypes['LearningGoalStartedByItem']> = ResolversObject<{
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<APIResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalStartedByResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedByResults'] = APIResolversParentTypes['LearningGoalStartedByResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<APIResolversTypes['LearningGoalStartedByItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalStartedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningGoalStartedResult'] = APIResolversParentTypes['LearningGoalStartedResult']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>;
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningGoalTypeResolvers = EnumResolverSignature<{ Roadmap?: any, SubGoal?: any }, APIResolversTypes['LearningGoalType']>;

export type APILearningMaterialResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterial'] = APIResolversParentTypes['LearningMaterial']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LearningPath' | 'Resource', ParentType, ContextType>;
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Maybe<APIResolversTypes['CommentResults']>, ParentType, ContextType, RequireFields<APILearningMaterialCommentsArgs, 'options'>>;
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APILearningMaterialCoveredSubTopicsArgs, 'options'>>;
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>;
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  recommendationsCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  recommended?: Resolver<Maybe<APIResolversTypes['LearningMaterialRecommended']>, ParentType, ContextType>;
  recommendedBy?: Resolver<Maybe<Array<APIResolversTypes['UserRecommendedLearningMaterial']>>, ParentType, ContextType, RequireFields<APILearningMaterialRecommendedByArgs, never>>;
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>;
}>;

export type APILearningMaterialCoveredSubTopicsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialCoveredSubTopicsResults'] = APIResolversParentTypes['LearningMaterialCoveredSubTopicsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningMaterialCoversTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialCoversTopic'] = APIResolversParentTypes['LearningMaterialCoversTopic']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdByUserId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>;
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningMaterialHasPrerequisiteTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialHasPrerequisiteTopic'] = APIResolversParentTypes['LearningMaterialHasPrerequisiteTopic']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdByUserId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>;
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningMaterialRecommendedResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialRecommended'] = APIResolversParentTypes['LearningMaterialRecommended']> = ResolversObject<{
  recommendedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningMaterialTagResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialTag'] = APIResolversParentTypes['LearningMaterialTag']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningMaterialTagSearchResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterialTagSearchResult'] = APIResolversParentTypes['LearningMaterialTagSearchResult']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  usageCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPath'] = APIResolversParentTypes['LearningPath']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Maybe<APIResolversTypes['CommentResults']>, ParentType, ContextType, RequireFields<APILearningPathCommentsArgs, 'options'>>;
  complementaryResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>;
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APILearningPathCoveredSubTopicsArgs, 'options'>>;
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  outro?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>;
  public?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  recommendationsCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  recommended?: Resolver<Maybe<APIResolversTypes['LearningMaterialRecommended']>, ParentType, ContextType>;
  recommendedBy?: Resolver<Maybe<Array<APIResolversTypes['UserRecommendedLearningMaterial']>>, ParentType, ContextType, RequireFields<APILearningPathRecommendedByArgs, never>>;
  resourceItems?: Resolver<Maybe<Array<APIResolversTypes['LearningPathResourceItem']>>, ParentType, ContextType>;
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  started?: Resolver<Maybe<APIResolversTypes['LearningPathStarted']>, ParentType, ContextType>;
  startedBy?: Resolver<Maybe<APIResolversTypes['LearningPathStartedByResults']>, ParentType, ContextType, RequireFields<APILearningPathStartedByArgs, 'options'>>;
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathCompletedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathCompletedResult'] = APIResolversParentTypes['LearningPathCompletedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>;
  user?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathResourceItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathResourceItem'] = APIResolversParentTypes['LearningPathResourceItem']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  learningPathId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathStartedResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStarted'] = APIResolversParentTypes['LearningPathStarted']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathStartedByItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedByItem'] = APIResolversParentTypes['LearningPathStartedByItem']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<APIResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathStartedByResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedByResults'] = APIResolversParentTypes['LearningPathStartedByResults']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<APIResolversTypes['LearningPathStartedByItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathStartedItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedItem'] = APIResolversParentTypes['LearningPathStartedItem']> = ResolversObject<{
  completedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>;
  startedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILearningPathStartedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathStartedResult'] = APIResolversParentTypes['LearningPathStartedResult']> = ResolversObject<{
  learningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType>;
  user?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIListArticlesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ListArticlesResult'] = APIResolversParentTypes['ListArticlesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Article']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APILoginResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LoginResponse'] = APIResolversParentTypes['LoginResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>;
  jwt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  redirectUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  addComplementaryResourceToLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationAddComplementaryResourceToLearningPathArgs, 'learningPathId' | 'resourceId'>>;
  addLearningMaterialHasPrerequisiteTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddLearningMaterialHasPrerequisiteTopicArgs, 'learningMaterialId' | 'prerequisiteTopicId'>>;
  addSubResource?: Resolver<APIResolversTypes['SubResourceCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceArgs, 'parentResourceId' | 'subResourceId'>>;
  addSubResourceToSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceToSeriesArgs, 'parentResourceId' | 'previousResourceId' | 'subResourceId'>>;
  addSubTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationAddSubTopicArgs, 'parentTopicId' | 'payload'>>;
  addTagsToLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddTagsToLearningMaterialArgs, 'learningMaterialId' | 'tags'>>;
  addTopicHasPrerequisiteTopic?: Resolver<APIResolversTypes['AddTopicHasPrerequisiteTopicResult'], ParentType, ContextType, RequireFields<APIMutationAddTopicHasPrerequisiteTopicArgs, 'prerequisiteTopicId' | 'topicId'>>;
  addTopicTypesToTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationAddTopicTypesToTopicArgs, 'topicId' | 'topicTypes'>>;
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>;
  attachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>;
  attachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['AttachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationAttachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'payload' | 'subGoalId'>>;
  attachLearningMaterialCoversTopics?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialCoversTopicsArgs, 'learningMaterialId' | 'topicsIds'>>;
  attachTopicIsPartOfTopic?: Resolver<APIResolversTypes['TopicIsPartOfTopic'], ParentType, ContextType, RequireFields<APIMutationAttachTopicIsPartOfTopicArgs, 'partOfTopicId' | 'payload' | 'subTopicId'>>;
  attachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationAttachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'payload' | 'subTopicId'>>;
  completeLearningPath?: Resolver<APIResolversTypes['LearningPathCompletedResult'], ParentType, ContextType, RequireFields<APIMutationCompleteLearningPathArgs, 'completed' | 'learningPathId'>>;
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>;
  createDisambiguationFromTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationCreateDisambiguationFromTopicArgs, 'existingTopicContextTopicId' | 'existingTopicId'>>;
  createLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationCreateLearningGoalArgs, 'payload'>>;
  createLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationCreateLearningPathArgs, 'payload'>>;
  createResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationCreateResourceArgs, 'payload'>>;
  createSubResourceSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationCreateSubResourceSeriesArgs, 'parentResourceId' | 'subResourceId'>>;
  createTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationCreateTopicArgs, 'payload'>>;
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>;
  deleteLearningGoal?: Resolver<APIResolversTypes['DeleteLearningGoalMutationResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningGoalArgs, '_id'>>;
  deleteLearningPath?: Resolver<APIResolversTypes['DeleteLearningPathResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningPathArgs, 'learningPathId'>>;
  deleteResource?: Resolver<APIResolversTypes['DeleteResourceResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteResourceArgs, 'resourceId'>>;
  deleteTopic?: Resolver<APIResolversTypes['DeleteTopicResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteTopicArgs, 'topicId'>>;
  detachLearningGoalDependency?: Resolver<APIResolversTypes['UpdateLearningGoalDependenciesResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalDependencyArgs, 'learningGoalDependencyId' | 'learningGoalId' | 'parentLearningGoalId'>>;
  detachLearningGoalRequiresSubGoal?: Resolver<APIResolversTypes['DetachLearningGoalRequiresSubGoalResult'], ParentType, ContextType, RequireFields<APIMutationDetachLearningGoalRequiresSubGoalArgs, 'learningGoalId' | 'subGoalId'>>;
  detachLearningMaterialCoversTopics?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialCoversTopicsArgs, 'learningMaterialId' | 'topicsIds'>>;
  detachTopicIsPartOfTopic?: Resolver<APIResolversTypes['DetachTopicIsPartOfTopicResult'], ParentType, ContextType, RequireFields<APIMutationDetachTopicIsPartOfTopicArgs, 'partOfTopicId' | 'subTopicId'>>;
  detachTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['DetachTopicIsSubTopicOfTopicResult'], ParentType, ContextType, RequireFields<APIMutationDetachTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'subTopicId'>>;
  downvoteLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDownvoteLearningMaterialArgs, 'learningMaterialId'>>;
  editComment?: Resolver<APIResolversTypes['Comment'], ParentType, ContextType, RequireFields<APIMutationEditCommentArgs, 'commentId' | 'payload'>>;
  hideLearningGoalFromTopic?: Resolver<APIResolversTypes['ShowLearningGoalInTopicResult'], ParentType, ContextType, RequireFields<APIMutationHideLearningGoalFromTopicArgs, 'learningGoalId' | 'topicId'>>;
  hideLearningMaterialFromTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationHideLearningMaterialFromTopicArgs, 'learningMaterialId' | 'topicId'>>;
  indexLearningGoal?: Resolver<APIResolversTypes['LearningGoalIndexedResult'], ParentType, ContextType, RequireFields<APIMutationIndexLearningGoalArgs, 'learningGoalId'>>;
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>;
  loginGoogle?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginGoogleArgs, 'idToken'>>;
  postComment?: Resolver<APIResolversTypes['Comment'], ParentType, ContextType, RequireFields<APIMutationPostCommentArgs, 'payload'>>;
  publishLearningGoal?: Resolver<APIResolversTypes['LearningGoalPublishedResult'], ParentType, ContextType, RequireFields<APIMutationPublishLearningGoalArgs, 'learningGoalId'>>;
  rateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationRateLearningGoalArgs, 'learningGoalId' | 'value'>>;
  rateLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRateLearningMaterialArgs, 'learningMaterialId' | 'value'>>;
  recommendLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRecommendLearningMaterialArgs, 'learningMaterialId'>>;
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>;
  registerGoogle?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterGoogleArgs, 'payload'>>;
  removeComplementaryResourceFromLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationRemoveComplementaryResourceFromLearningPathArgs, 'learningPathId' | 'resourceId'>>;
  removeLearningMaterialHasPrerequisiteTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveLearningMaterialHasPrerequisiteTopicArgs, 'learningMaterialId' | 'prerequisiteTopicId'>>;
  removeTagsFromLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveTagsFromLearningMaterialArgs, 'learningMaterialId' | 'tags'>>;
  removeTopicHasPrerequisiteTopic?: Resolver<APIResolversTypes['RemoveTopicHasPrerequisiteTopicResult'], ParentType, ContextType, RequireFields<APIMutationRemoveTopicHasPrerequisiteTopicArgs, 'prerequisiteTopicId' | 'topicId'>>;
  removeTopicTypesFromTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationRemoveTopicTypesFromTopicArgs, 'topicId' | 'topicTypes'>>;
  resetPassword?: Resolver<APIResolversTypes['ResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationResetPasswordArgs, 'payload'>>;
  setResourcesConsumed?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType, RequireFields<APIMutationSetResourcesConsumedArgs, 'payload'>>;
  setTopicsKnown?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType, RequireFields<APIMutationSetTopicsKnownArgs, 'payload'>>;
  setTopicsUnknown?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType, RequireFields<APIMutationSetTopicsUnknownArgs, 'topicIds'>>;
  showLearningGoalInTopic?: Resolver<APIResolversTypes['ShowLearningGoalInTopicResult'], ParentType, ContextType, RequireFields<APIMutationShowLearningGoalInTopicArgs, 'learningGoalId' | 'payload' | 'topicId'>>;
  showLearningMaterialInTopic?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationShowLearningMaterialInTopicArgs, 'learningMaterialId' | 'topicId'>>;
  startLearningGoal?: Resolver<APIResolversTypes['LearningGoalStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningGoalArgs, 'learningGoalId'>>;
  startLearningPath?: Resolver<APIResolversTypes['LearningPathStartedResult'], ParentType, ContextType, RequireFields<APIMutationStartLearningPathArgs, 'learningPathId'>>;
  triggerResetPassword?: Resolver<APIResolversTypes['TriggerResetPasswordResponse'], ParentType, ContextType, RequireFields<APIMutationTriggerResetPasswordArgs, 'email'>>;
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>;
  updateCurrentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationUpdateCurrentUserArgs, 'payload'>>;
  updateLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningGoalArgs, '_id' | 'payload'>>;
  updateLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningPathArgs, 'learningPathId' | 'payload'>>;
  updateResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationUpdateResourceArgs, 'payload' | 'resourceId'>>;
  updateTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicArgs, 'payload' | 'topicId'>>;
  updateTopicContext?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicContextArgs, 'contextTopicId' | 'topicId'>>;
  updateTopicIsPartOfTopic?: Resolver<APIResolversTypes['TopicIsPartOfTopic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicIsPartOfTopicArgs, 'partOfTopicId' | 'payload' | 'subTopicId'>>;
  updateTopicIsSubTopicOfTopic?: Resolver<APIResolversTypes['TopicIsSubTopicOfTopic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicIsSubTopicOfTopicArgs, 'parentTopicId' | 'payload' | 'subTopicId'>>;
  updateTopicTopicTypes?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIMutationUpdateTopicTopicTypesArgs, 'topicId' | 'topicTypesNames'>>;
  verifyEmailAddress?: Resolver<APIResolversTypes['VerifyEmailResponse'], ParentType, ContextType, RequireFields<APIMutationVerifyEmailAddressArgs, 'token'>>;
}>;

export type APIPulledDescriptionResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['PulledDescription'] = APIResolversParentTypes['PulledDescription']> = ResolversObject<{
  description?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  resultName?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  sourceName?: Resolver<APIResolversTypes['PulledDescriptionSourceName'], ParentType, ContextType>;
  sourceUrl?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIPulledDescriptionSourceNameResolvers = EnumResolverSignature<{ google?: any, wikipedia?: any }, APIResolversTypes['PulledDescriptionSourceName']>;

export type APIQueryResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Query'] = APIResolversParentTypes['Query']> = ResolversObject<{
  analyzeResourceUrl?: Resolver<APIResolversTypes['AnalyzeResourceUrlResult'], ParentType, ContextType, RequireFields<APIQueryAnalyzeResourceUrlArgs, 'url'>>;
  autocompleteTopicName?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQueryAutocompleteTopicNameArgs, 'partialName'>>;
  checkLearningGoalKeyAvailability?: Resolver<APIResolversTypes['CheckLearningGoalKeyAvailabilityResult'], ParentType, ContextType, RequireFields<APIQueryCheckLearningGoalKeyAvailabilityArgs, 'key'>>;
  checkTopicKeyAvailability?: Resolver<APIResolversTypes['CheckTopicKeyAvailabilityResult'], ParentType, ContextType, RequireFields<APIQueryCheckTopicKeyAvailabilityArgs, 'key'>>;
  checkUserKeyAvailability?: Resolver<APIResolversTypes['CheckUserKeyAvailabilityResult'], ParentType, ContextType, RequireFields<APIQueryCheckUserKeyAvailabilityArgs, 'key'>>;
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>;
  getArticleByKey?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleByKeyArgs, 'key'>>;
  getCommentById?: Resolver<APIResolversTypes['Comment'], ParentType, ContextType, RequireFields<APIQueryGetCommentByIdArgs, 'commentId'>>;
  getHomePageData?: Resolver<APIResolversTypes['GetHomePageDataResults'], ParentType, ContextType>;
  getLearningGoalByKey?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType, RequireFields<APIQueryGetLearningGoalByKeyArgs, 'key'>>;
  getLearningPathById?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByIdArgs, 'learningPathId'>>;
  getLearningPathByKey?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByKeyArgs, 'learningPathKey'>>;
  getResourceById?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByIdArgs, 'resourceId'>>;
  getResourceByKey?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByKeyArgs, 'resourceKey'>>;
  getTopLevelTopics?: Resolver<APIResolversTypes['GetTopLevelTopicsResults'], ParentType, ContextType>;
  getTopicById?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIQueryGetTopicByIdArgs, 'topicId'>>;
  getTopicByKey?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType, RequireFields<APIQueryGetTopicByKeyArgs, 'topicKey'>>;
  getTopicValidContexts?: Resolver<APIResolversTypes['GetTopicValidContextsResult'], ParentType, ContextType, RequireFields<APIQueryGetTopicValidContextsArgs, 'parentTopicId' | 'topicId'>>;
  getTopicValidContextsFromDisambiguation?: Resolver<APIResolversTypes['GetTopicValidContextsFromDisambiguation'], ParentType, ContextType, RequireFields<APIQueryGetTopicValidContextsFromDisambiguationArgs, 'disambiguationTopicId' | 'parentTopicId'>>;
  getTopicValidContextsFromSameName?: Resolver<APIResolversTypes['GetTopicValidContextsFromSameName'], ParentType, ContextType, RequireFields<APIQueryGetTopicValidContextsFromSameNameArgs, 'existingSameNameTopicId' | 'parentTopicId'>>;
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>;
  globalSearch?: Resolver<APIResolversTypes['GlobalSearchResults'], ParentType, ContextType, RequireFields<APIQueryGlobalSearchArgs, 'query'>>;
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>;
  pullTopicDescriptions?: Resolver<Array<APIResolversTypes['PulledDescription']>, ParentType, ContextType, RequireFields<APIQueryPullTopicDescriptionsArgs, 'queryOptions'>>;
  searchLearningGoals?: Resolver<APIResolversTypes['SearchLearningGoalsResult'], ParentType, ContextType, RequireFields<APIQuerySearchLearningGoalsArgs, 'options'>>;
  searchLearningMaterialTags?: Resolver<Array<APIResolversTypes['LearningMaterialTagSearchResult']>, ParentType, ContextType, RequireFields<APIQuerySearchLearningMaterialTagsArgs, 'options'>>;
  searchResources?: Resolver<APIResolversTypes['SearchResourcesResult'], ParentType, ContextType, RequireFields<APIQuerySearchResourcesArgs, 'options' | 'query'>>;
  searchSubTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchSubTopicsArgs, 'options' | 'topicIds'>>;
  searchTopicTypes?: Resolver<Array<APIResolversTypes['TopicType']>, ParentType, ContextType, RequireFields<APIQuerySearchTopicTypesArgs, 'query'>>;
  searchTopics?: Resolver<APIResolversTypes['SearchTopicsResult'], ParentType, ContextType, RequireFields<APIQuerySearchTopicsArgs, 'options'>>;
}>;

export type APIRemoveTopicHasPrerequisiteTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['RemoveTopicHasPrerequisiteTopicResult'] = APIResolversParentTypes['RemoveTopicHasPrerequisiteTopicResult']> = ResolversObject<{
  prerequisiteTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIRequiredInGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['RequiredInGoalItem'] = APIResolversParentTypes['RequiredInGoalItem']> = ResolversObject<{
  goal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIResetPasswordResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResetPasswordResponse'] = APIResolversParentTypes['ResetPasswordResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Resource'] = APIResolversParentTypes['Resource']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Maybe<APIResolversTypes['CommentResults']>, ParentType, ContextType, RequireFields<APIResourceCommentsArgs, 'options'>>;
  consumed?: Resolver<Maybe<APIResolversTypes['ConsumedResource']>, ParentType, ContextType>;
  coveredSubTopics?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredSubTopicsResults']>, ParentType, ContextType, RequireFields<APIResourceCoveredSubTopicsArgs, 'options'>>;
  coveredSubTopicsTree?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  nextResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>;
  parentResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialHasPrerequisiteTopic']>>, ParentType, ContextType>;
  previousResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  recommendationsCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  recommended?: Resolver<Maybe<APIResolversTypes['LearningMaterialRecommended']>, ParentType, ContextType>;
  recommendedBy?: Resolver<Maybe<Array<APIResolversTypes['UserRecommendedLearningMaterial']>>, ParentType, ContextType, RequireFields<APIResourceRecommendedByArgs, never>>;
  seriesParentResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>;
  showedIn?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  subResourceSeries?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>;
  subResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>;
  types?: Resolver<Array<APIResolversTypes['ResourceType']>, ParentType, ContextType>;
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIResourceDataResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceData'] = APIResolversParentTypes['ResourceData']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  subResourceSeries?: Resolver<Maybe<Array<APIResolversTypes['SubResourceExtractedData']>>, ParentType, ContextType>;
  types?: Resolver<Maybe<Array<APIResolversTypes['ResourceType']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIResourceTypeResolvers = EnumResolverSignature<{ article?: any, article_series?: any, book?: any, course?: any, documentary?: any, exercise?: any, infographic?: any, online_book?: any, other?: any, podcast?: any, podcast_episode?: any, project?: any, research_paper?: any, talk?: any, tweet?: any, video_game?: any, website?: any, youtube_playlist?: any, youtube_video?: any }, APIResolversTypes['ResourceType']>;

export type APISearchLearningGoalsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchLearningGoalsResult'] = APIResolversParentTypes['SearchLearningGoalsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['LearningGoal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISearchResourcesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResourcesResult'] = APIResolversParentTypes['SearchResourcesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISearchResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResult'] = APIResolversParentTypes['SearchResult']> = ResolversObject<{
  entity?: Resolver<APIResolversTypes['SearchResultEntity'], ParentType, ContextType>;
  score?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISearchResultEntityResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchResultEntity'] = APIResolversParentTypes['SearchResultEntity']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LearningPath' | 'Resource' | 'Topic', ParentType, ContextType>;
}>;

export type APISearchTopicsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchTopicsResult'] = APIResolversParentTypes['SearchTopicsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIShowLearningGoalInTopicResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ShowLearningGoalInTopicResult'] = APIResolversParentTypes['ShowLearningGoalInTopicResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  topic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISubGoalResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubGoal'] = APIResolversParentTypes['SubGoal']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LearningGoal' | 'Topic', ParentType, ContextType>;
}>;

export type APISubGoalItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubGoalItem'] = APIResolversParentTypes['SubGoalItem']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  subGoal?: Resolver<APIResolversTypes['SubGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISubResourceCreatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceCreatedResult'] = APIResolversParentTypes['SubResourceCreatedResult']> = ResolversObject<{
  parentResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  subResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISubResourceExtractedDataResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceExtractedData'] = APIResolversParentTypes['SubResourceExtractedData']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  durationSeconds?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  types?: Resolver<Array<APIResolversTypes['ResourceType']>, ParentType, ContextType>;
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISubResourceSeriesCreatedResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SubResourceSeriesCreatedResult'] = APIResolversParentTypes['SubResourceSeriesCreatedResult']> = ResolversObject<{
  seriesParentResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  subResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APISubTopicRelationshipTypeResolvers = EnumResolverSignature<{ IS_PART_OF?: any, IS_SUBTOPIC_OF?: any }, APIResolversTypes['SubTopicRelationshipType']>;

export type APITagFilterResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TagFilter'] = APIResolversParentTypes['TagFilter']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Topic'] = APIResolversParentTypes['Topic']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  aggregatedSubtopicsPrerequisites?: Resolver<Maybe<Array<APIResolversTypes['AggregatedSubtopicPrerequisite']>>, ParentType, ContextType, RequireFields<APITopicAggregatedSubtopicsPrerequisitesArgs, 'options'>>;
  aliases?: Resolver<Maybe<Array<APIResolversTypes['String']>>, ParentType, ContextType>;
  comments?: Resolver<Maybe<APIResolversTypes['CommentResults']>, ParentType, ContextType, RequireFields<APITopicCommentsArgs, 'options'>>;
  context?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  contextTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>;
  contextualisedTopics?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>;
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  descriptionSourceUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  disambiguationTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>;
  followUps?: Resolver<Maybe<Array<APIResolversTypes['TopicHasPrerequisiteTopic']>>, ParentType, ContextType>;
  isDisambiguation?: Resolver<Maybe<APIResolversTypes['Boolean']>, ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  learningMaterials?: Resolver<Maybe<APIResolversTypes['TopicLearningMaterialsResults']>, ParentType, ContextType, RequireFields<APITopicLearningMaterialsArgs, 'options'>>;
  learningMaterialsAvailableTypeFilters?: Resolver<Maybe<APIResolversTypes['TopicLearningMaterialsAvailableTypeFilters']>, ParentType, ContextType>;
  learningMaterialsTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  level?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>;
  managePageComments?: Resolver<Maybe<APIResolversTypes['CommentResults']>, ParentType, ContextType, RequireFields<APITopicManagePageCommentsArgs, 'options'>>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  otherContextsTopics?: Resolver<Maybe<Array<APIResolversTypes['Topic']>>, ParentType, ContextType>;
  parentTopic?: Resolver<Maybe<APIResolversTypes['Topic']>, ParentType, ContextType>;
  partOfTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsPartOfTopic']>>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<APIResolversTypes['TopicHasPrerequisiteTopic']>>, ParentType, ContextType>;
  subTopics?: Resolver<Maybe<Array<APIResolversTypes['TopicIsSubTopicOfTopic']>>, ParentType, ContextType, RequireFields<APITopicSubTopicsArgs, never>>;
  subTopicsTotalCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  topicTypes?: Resolver<Maybe<Array<APIResolversTypes['TopicType']>>, ParentType, ContextType>;
  wikipediaPageUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicHasPrerequisiteTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicHasPrerequisiteTopic'] = APIResolversParentTypes['TopicHasPrerequisiteTopic']> = ResolversObject<{
  followUpTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  prerequisiteTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicIsPartOfTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicIsPartOfTopic'] = APIResolversParentTypes['TopicIsPartOfTopic']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdByUserId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  partOfTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicIsSubTopicOfTopicResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicIsSubTopicOfTopic'] = APIResolversParentTypes['TopicIsSubTopicOfTopic']> = ResolversObject<{
  createdAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  createdByUserId?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>;
  parentTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  relationshipType?: Resolver<APIResolversTypes['SubTopicRelationshipType'], ParentType, ContextType>;
  subTopic?: Resolver<APIResolversTypes['Topic'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicLearningMaterialsAvailableTypeFiltersResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicLearningMaterialsAvailableTypeFilters'] = APIResolversParentTypes['TopicLearningMaterialsAvailableTypeFilters']> = ResolversObject<{
  geq30minCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  learningPathsCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  leq30minCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  types?: Resolver<Array<APIResolversTypes['ResourceType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicLearningMaterialsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicLearningMaterialsResults'] = APIResolversParentTypes['TopicLearningMaterialsResults']> = ResolversObject<{
  availableTagFilters?: Resolver<Array<APIResolversTypes['TagFilter']>, ParentType, ContextType>;
  items?: Resolver<Array<APIResolversTypes['LearningMaterial']>, ParentType, ContextType>;
  totalCount?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicTypeResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TopicType'] = APIResolversParentTypes['TopicType']> = ResolversObject<{
  color?: Resolver<Maybe<APIResolversTypes['TopicTypeColor']>, ParentType, ContextType>;
  iconName?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  usageCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APITopicTypeColorResolvers = EnumResolverSignature<{ blue?: any, green?: any, orange?: any, red?: any }, APIResolversTypes['TopicTypeColor']>;

export type APITriggerResetPasswordResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['TriggerResetPasswordResponse'] = APIResolversParentTypes['TriggerResetPasswordResponse']> = ResolversObject<{
  errorMessage?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUpdateLearningGoalDependenciesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UpdateLearningGoalDependenciesResult'] = APIResolversParentTypes['UpdateLearningGoalDependenciesResult']> = ResolversObject<{
  learningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  learningGoalDependency?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  parentLearningGoal?: Resolver<APIResolversTypes['LearningGoal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APIUserArticlesArgs, 'options'>>;
  bio?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  profilePictureUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUserConsumedResourceItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UserConsumedResourceItem'] = APIResolversParentTypes['UserConsumedResourceItem']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  lastOpenedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  openedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>;
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUserConsumedResourcesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UserConsumedResourcesResult'] = APIResolversParentTypes['UserConsumedResourcesResult']> = ResolversObject<{
  count?: Resolver<APIResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<APIResolversTypes['UserConsumedResourceItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUserRecommendedLearningMaterialResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['UserRecommendedLearningMaterial'] = APIResolversParentTypes['UserRecommendedLearningMaterial']> = ResolversObject<{
  learningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType>;
  recommendedAt?: Resolver<APIResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<APIResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIUserRoleResolvers = EnumResolverSignature<{ ADMIN?: any, CONTRIBUTOR?: any, USER?: any }, APIResolversTypes['UserRole']>;

export type APIVerifyEmailResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['VerifyEmailResponse'] = APIResolversParentTypes['VerifyEmailResponse']> = ResolversObject<{
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  AddTopicHasPrerequisiteTopicResult?: APIAddTopicHasPrerequisiteTopicResultResolvers<ContextType>;
  AggregatedSubtopicPrerequisite?: APIAggregatedSubtopicPrerequisiteResolvers<ContextType>;
  AnalyzeResourceUrlResult?: APIAnalyzeResourceUrlResultResolvers<ContextType>;
  Article?: APIArticleResolvers<ContextType>;
  ArticleContentType?: APIArticleContentTypeResolvers;
  AttachLearningGoalRequiresSubGoalResult?: APIAttachLearningGoalRequiresSubGoalResultResolvers<ContextType>;
  CheckLearningGoalKeyAvailabilityResult?: APICheckLearningGoalKeyAvailabilityResultResolvers<ContextType>;
  CheckTopicKeyAvailabilityResult?: APICheckTopicKeyAvailabilityResultResolvers<ContextType>;
  CheckUserKeyAvailabilityResult?: APICheckUserKeyAvailabilityResultResolvers<ContextType>;
  Comment?: APICommentResolvers<ContextType>;
  CommentResults?: APICommentResultsResolvers<ContextType>;
  ComplementaryResourceUpdatedResult?: APIComplementaryResourceUpdatedResultResolvers<ContextType>;
  ConsumedResource?: APIConsumedResourceResolvers<ContextType>;
  CurrentUser?: APICurrentUserResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeleteArticleResponse?: APIDeleteArticleResponseResolvers<ContextType>;
  DeleteLearningGoalMutationResult?: APIDeleteLearningGoalMutationResultResolvers<ContextType>;
  DeleteLearningPathResult?: APIDeleteLearningPathResultResolvers<ContextType>;
  DeleteResourceResponse?: APIDeleteResourceResponseResolvers<ContextType>;
  DeleteTopicResponse?: APIDeleteTopicResponseResolvers<ContextType>;
  DependsOnGoalItem?: APIDependsOnGoalItemResolvers<ContextType>;
  DetachLearningGoalRequiresSubGoalResult?: APIDetachLearningGoalRequiresSubGoalResultResolvers<ContextType>;
  DetachTopicIsPartOfTopicResult?: APIDetachTopicIsPartOfTopicResultResolvers<ContextType>;
  DetachTopicIsSubTopicOfTopicResult?: APIDetachTopicIsSubTopicOfTopicResultResolvers<ContextType>;
  GetHomePageDataResults?: APIGetHomePageDataResultsResolvers<ContextType>;
  GetTopLevelTopicsResults?: APIGetTopLevelTopicsResultsResolvers<ContextType>;
  GetTopicValidContextsFromDisambiguation?: APIGetTopicValidContextsFromDisambiguationResolvers<ContextType>;
  GetTopicValidContextsFromSameName?: APIGetTopicValidContextsFromSameNameResolvers<ContextType>;
  GetTopicValidContextsResult?: APIGetTopicValidContextsResultResolvers<ContextType>;
  GlobalSearchResults?: APIGlobalSearchResultsResolvers<ContextType>;
  KnownTopic?: APIKnownTopicResolvers<ContextType>;
  LearningGoal?: APILearningGoalResolvers<ContextType>;
  LearningGoalIndexedResult?: APILearningGoalIndexedResultResolvers<ContextType>;
  LearningGoalProgress?: APILearningGoalProgressResolvers<ContextType>;
  LearningGoalPublishedResult?: APILearningGoalPublishedResultResolvers<ContextType>;
  LearningGoalRelevantLearningMaterialsItem?: APILearningGoalRelevantLearningMaterialsItemResolvers<ContextType>;
  LearningGoalRelevantLearningMaterialsResults?: APILearningGoalRelevantLearningMaterialsResultsResolvers<ContextType>;
  LearningGoalStarted?: APILearningGoalStartedResolvers<ContextType>;
  LearningGoalStartedByItem?: APILearningGoalStartedByItemResolvers<ContextType>;
  LearningGoalStartedByResults?: APILearningGoalStartedByResultsResolvers<ContextType>;
  LearningGoalStartedResult?: APILearningGoalStartedResultResolvers<ContextType>;
  LearningGoalType?: APILearningGoalTypeResolvers;
  LearningMaterial?: APILearningMaterialResolvers<ContextType>;
  LearningMaterialCoveredSubTopicsResults?: APILearningMaterialCoveredSubTopicsResultsResolvers<ContextType>;
  LearningMaterialCoversTopic?: APILearningMaterialCoversTopicResolvers<ContextType>;
  LearningMaterialHasPrerequisiteTopic?: APILearningMaterialHasPrerequisiteTopicResolvers<ContextType>;
  LearningMaterialRecommended?: APILearningMaterialRecommendedResolvers<ContextType>;
  LearningMaterialTag?: APILearningMaterialTagResolvers<ContextType>;
  LearningMaterialTagSearchResult?: APILearningMaterialTagSearchResultResolvers<ContextType>;
  LearningPath?: APILearningPathResolvers<ContextType>;
  LearningPathCompletedResult?: APILearningPathCompletedResultResolvers<ContextType>;
  LearningPathResourceItem?: APILearningPathResourceItemResolvers<ContextType>;
  LearningPathStarted?: APILearningPathStartedResolvers<ContextType>;
  LearningPathStartedByItem?: APILearningPathStartedByItemResolvers<ContextType>;
  LearningPathStartedByResults?: APILearningPathStartedByResultsResolvers<ContextType>;
  LearningPathStartedItem?: APILearningPathStartedItemResolvers<ContextType>;
  LearningPathStartedResult?: APILearningPathStartedResultResolvers<ContextType>;
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>;
  LoginResponse?: APILoginResponseResolvers<ContextType>;
  Mutation?: APIMutationResolvers<ContextType>;
  PulledDescription?: APIPulledDescriptionResolvers<ContextType>;
  PulledDescriptionSourceName?: APIPulledDescriptionSourceNameResolvers;
  Query?: APIQueryResolvers<ContextType>;
  RemoveTopicHasPrerequisiteTopicResult?: APIRemoveTopicHasPrerequisiteTopicResultResolvers<ContextType>;
  RequiredInGoalItem?: APIRequiredInGoalItemResolvers<ContextType>;
  ResetPasswordResponse?: APIResetPasswordResponseResolvers<ContextType>;
  Resource?: APIResourceResolvers<ContextType>;
  ResourceData?: APIResourceDataResolvers<ContextType>;
  ResourceType?: APIResourceTypeResolvers;
  SearchLearningGoalsResult?: APISearchLearningGoalsResultResolvers<ContextType>;
  SearchResourcesResult?: APISearchResourcesResultResolvers<ContextType>;
  SearchResult?: APISearchResultResolvers<ContextType>;
  SearchResultEntity?: APISearchResultEntityResolvers<ContextType>;
  SearchTopicsResult?: APISearchTopicsResultResolvers<ContextType>;
  ShowLearningGoalInTopicResult?: APIShowLearningGoalInTopicResultResolvers<ContextType>;
  SubGoal?: APISubGoalResolvers<ContextType>;
  SubGoalItem?: APISubGoalItemResolvers<ContextType>;
  SubResourceCreatedResult?: APISubResourceCreatedResultResolvers<ContextType>;
  SubResourceExtractedData?: APISubResourceExtractedDataResolvers<ContextType>;
  SubResourceSeriesCreatedResult?: APISubResourceSeriesCreatedResultResolvers<ContextType>;
  SubTopicRelationshipType?: APISubTopicRelationshipTypeResolvers;
  TagFilter?: APITagFilterResolvers<ContextType>;
  Topic?: APITopicResolvers<ContextType>;
  TopicHasPrerequisiteTopic?: APITopicHasPrerequisiteTopicResolvers<ContextType>;
  TopicIsPartOfTopic?: APITopicIsPartOfTopicResolvers<ContextType>;
  TopicIsSubTopicOfTopic?: APITopicIsSubTopicOfTopicResolvers<ContextType>;
  TopicLearningMaterialsAvailableTypeFilters?: APITopicLearningMaterialsAvailableTypeFiltersResolvers<ContextType>;
  TopicLearningMaterialsResults?: APITopicLearningMaterialsResultsResolvers<ContextType>;
  TopicType?: APITopicTypeResolvers<ContextType>;
  TopicTypeColor?: APITopicTypeColorResolvers;
  TriggerResetPasswordResponse?: APITriggerResetPasswordResponseResolvers<ContextType>;
  UpdateLearningGoalDependenciesResult?: APIUpdateLearningGoalDependenciesResultResolvers<ContextType>;
  User?: APIUserResolvers<ContextType>;
  UserConsumedResourceItem?: APIUserConsumedResourceItemResolvers<ContextType>;
  UserConsumedResourcesResult?: APIUserConsumedResourcesResultResolvers<ContextType>;
  UserRecommendedLearningMaterial?: APIUserRecommendedLearningMaterialResolvers<ContextType>;
  UserRole?: APIUserRoleResolvers;
  VerifyEmailResponse?: APIVerifyEmailResponseResolvers<ContextType>;
}>;

