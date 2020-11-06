import { ArticleContentType } from '../../entities/Article';
import { UserRole } from '../../entities/User';
import { ResourceType } from '../../entities/Resource';
import { ResourceMediaType } from '../../entities/Resource';
import { SortingDirection } from '../../repositories/util/sorting';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { APIContext } from '../server';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * import * from "common/PaginationOptions.graphql"
   * import * from "common/SortingDirection.graphql"
   * import Query.*, Mutation.* from "User.graphql"
   * import Query.*, Mutation.* from "Article.graphql"
   * import Query.*, Mutation.* from "Domain.graphql"
   * import Query.*, Mutation.* from "LearningMaterialTag.graphql"
   * import Mutation.* from "LearningMaterial.graphql"
   * import Query.*, Mutation.* from "Resource.graphql"
   * import Query.*, Mutation.* from "Concept.graphql"
   * import Query.*, Mutation.* from "LearningPath.graphql"
   * import Mutation.* from "./relationships/ConceptBelongsToDomain.graphql"
   * import Mutation.* from "./relationships/ConceptBelongsToConcept.graphql"
   * import Mutation.* from "./relationships/DomainBelongsToDomain.graphql"
   * import * from "./relationships/ConceptReferencesConcept.graphql"
   */
  Date: Date;
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
  currentUser?: Maybe<APICurrentUser>;
  getArticleByKey: APIArticle;
  getConcept: APIConcept;
  getDomainByKey: APIDomain;
  getDomainConceptByKey: APIConcept;
  getLearningPath: APILearningPath;
  getLearningPathByKey: APILearningPath;
  getResourceById: APIResource;
  getUser: APIUser;
  listArticles: APIListArticlesResult;
  searchDomains: APISearchDomainsResult;
  searchLearningMaterialTags: Array<APILearningMaterialTagSearchResult>;
  searchResources: APISearchResourcesResult;
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


export type APIQueryGetLearningPathArgs = {
  _id: Scalars['String'];
};


export type APIQueryGetLearningPathByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetResourceByIdArgs = {
  id: Scalars['String'];
};


export type APIQueryGetUserArgs = {
  key: Scalars['String'];
};


export type APIQueryListArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APIQuerySearchDomainsArgs = {
  options: APISearchDomainsOptions;
};


export type APIQuerySearchLearningMaterialTagsArgs = {
  options: APISearchLearningMaterialTagsOptions;
};


export type APIQuerySearchResourcesArgs = {
  options: APISearchResourcesOptions;
  query: Scalars['String'];
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
  addConceptBelongsToConcept: APIConcept;
  addConceptReferencesConcept: APIConcept;
  addConceptToDomain: APIConcept;
  addDomainBelongsToDomain: APIDomain;
  addResourceToDomain: APIResource;
  addSubResource: APISubResourceCreatedResult;
  addSubResourceToSeries: APISubResourceSeriesCreatedResult;
  addTagsToLearningMaterial: APILearningMaterial;
  adminUpdateUser: APIUser;
  attachLearningMaterialCoversConcepts: APILearningMaterial;
  attachLearningMaterialToDomain: APILearningMaterial;
  attachResourceCoversConcepts: APIResource;
  attachResourceToDomain: APIResource;
  createArticle: APIArticle;
  createDomain: APIDomain;
  createLearningPath: APILearningPath;
  createResource: APIResource;
  createSubResourceSeries: APISubResourceSeriesCreatedResult;
  deleteArticle: APIDeleteArticleResponse;
  deleteConcept: APIDeleteConceptResult;
  deleteDomain: APIDeleteDomainResponse;
  deleteLearningPath: APIDeleteLearningPathResult;
  deleteResource: APIDeleteResourceResponse;
  detachLearningMaterialCoversConcepts: APILearningMaterial;
  detachLearningMaterialFromDomain: APILearningMaterial;
  detachResourceCoversConcepts: APIResource;
  detachResourceFromDomain: APIResource;
  login: APILoginResponse;
  loginGoogle: APILoginResponse;
  rateLearningMaterial: APILearningMaterial;
  register: APICurrentUser;
  registerGoogle: APICurrentUser;
  removeComplementaryResourceFromLearningPath: APIComplementaryResourceUpdatedResult;
  removeConceptBelongsToConcept: APIConcept;
  removeConceptReferencesConcept: APIConcept;
  removeDomainBelongsToDomain: APIDomain;
  removeTagsFromLearningMaterial: APILearningMaterial;
  setConceptsKnown: Array<APIConcept>;
  setConceptsUnknown: Array<APIConcept>;
  setResourcesConsumed: Array<APIResource>;
  updateArticle: APIArticle;
  updateConcept: APIConcept;
  updateConceptBelongsToConcept: APIConcept;
  updateConceptBelongsToDomain: APIConceptBelongsToDomain;
  updateDomain: APIDomain;
  updateLearningPath: APILearningPath;
  updateResource: APIResource;
  verifyEmailAddress: APIVerifyEmailResponse;
  voteResource: APIResource;
};


export type APIMutationAddComplementaryResourceToLearningPathArgs = {
  learningPathId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationAddConceptBelongsToConceptArgs = {
  parentConceptId: Scalars['String'];
  subConceptId: Scalars['String'];
};


export type APIMutationAddConceptReferencesConceptArgs = {
  conceptId: Scalars['String'];
  referencedConceptId: Scalars['String'];
};


export type APIMutationAddConceptToDomainArgs = {
  domainId: Scalars['String'];
  payload: APIAddConceptToDomainPayload;
};


export type APIMutationAddDomainBelongsToDomainArgs = {
  parentDomainId: Scalars['String'];
  subDomainId: Scalars['String'];
};


export type APIMutationAddResourceToDomainArgs = {
  domainId: Scalars['String'];
  payload: APICreateResourcePayload;
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


export type APIMutationAttachLearningMaterialCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  learningMaterialId: Scalars['String'];
};


export type APIMutationAttachLearningMaterialToDomainArgs = {
  domainId: Scalars['String'];
  learningMaterialId: Scalars['String'];
};


export type APIMutationAttachResourceCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  resourceId: Scalars['String'];
};


export type APIMutationAttachResourceToDomainArgs = {
  domainId: Scalars['String'];
  resourceId: Scalars['String'];
};


export type APIMutationCreateArticleArgs = {
  payload: APICreateArticlePayload;
};


export type APIMutationCreateDomainArgs = {
  payload: APICreateDomainPayload;
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


export type APIMutationDeleteLearningPathArgs = {
  _id: Scalars['String'];
};


export type APIMutationDeleteResourceArgs = {
  _id: Scalars['String'];
};


export type APIMutationDetachLearningMaterialCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  learningMaterialId: Scalars['String'];
};


export type APIMutationDetachLearningMaterialFromDomainArgs = {
  domainId: Scalars['String'];
  learningMaterialId: Scalars['String'];
};


export type APIMutationDetachResourceCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
  resourceId: Scalars['String'];
};


export type APIMutationDetachResourceFromDomainArgs = {
  domainId: Scalars['String'];
  resourceId: Scalars['String'];
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


export type APIMutationRemoveConceptBelongsToConceptArgs = {
  parentConceptId: Scalars['String'];
  subConceptId: Scalars['String'];
};


export type APIMutationRemoveConceptReferencesConceptArgs = {
  conceptId: Scalars['String'];
  referencedConceptId: Scalars['String'];
};


export type APIMutationRemoveDomainBelongsToDomainArgs = {
  parentDomainId: Scalars['String'];
  subDomainId: Scalars['String'];
};


export type APIMutationRemoveTagsFromLearningMaterialArgs = {
  learningMaterialId: Scalars['String'];
  tags: Array<Scalars['String']>;
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


export type APIMutationUpdateArticleArgs = {
  id: Scalars['String'];
  payload: APIUpdateArticlePayload;
};


export type APIMutationUpdateConceptArgs = {
  _id: Scalars['String'];
  payload: APIUpdateConceptPayload;
};


export type APIMutationUpdateConceptBelongsToConceptArgs = {
  parentConceptId: Scalars['String'];
  subConceptId: Scalars['String'];
  payload: APIUpdateConceptBelongsToConceptPayload;
};


export type APIMutationUpdateConceptBelongsToDomainArgs = {
  conceptId: Scalars['String'];
  domainId: Scalars['String'];
  payload: APIUpdateConceptBelongsToDomainPayload;
};


export type APIMutationUpdateDomainArgs = {
  id: Scalars['String'];
  payload: APIUpdateDomainPayload;
};


export type APIMutationUpdateLearningPathArgs = {
  _id: Scalars['String'];
  payload: APIUpdateLearningPathPayload;
};


export type APIMutationUpdateResourceArgs = {
  _id: Scalars['String'];
  payload: APIUpdateResourcePayload;
};


export type APIMutationVerifyEmailAddressArgs = {
  token: Scalars['String'];
};


export type APIMutationVoteResourceArgs = {
  resourceId: Scalars['String'];
  value: APIResourceVoteValue;
};

export type APIConcept = {
   __typename?: 'Concept';
  _id: Scalars['String'];
  coveredByResources?: Maybe<APIConceptCoveredByResourcesResults>;
  description?: Maybe<Scalars['String']>;
  domain?: Maybe<APIDomain>;
  key: Scalars['String'];
  known?: Maybe<APIKnownConcept>;
  name: Scalars['String'];
  parentConcepts?: Maybe<Array<APIConceptBelongsToConceptItem>>;
  referencedByConcepts?: Maybe<Array<APIConceptReferencesConceptItem>>;
  referencingConcepts?: Maybe<Array<APIConceptReferencesConceptItem>>;
  subConcepts?: Maybe<Array<APIConceptBelongsToConceptItem>>;
};


export type APIConceptCoveredByResourcesArgs = {
  options: APIConceptCoveredByResourcesOptions;
};

export type APIKnownConcept = {
   __typename?: 'KnownConcept';
  level: Scalars['Float'];
};

export type APIConceptReferencesConceptItem = {
   __typename?: 'ConceptReferencesConceptItem';
  concept: APIConcept;
  relationship: APIConceptReferencesConcept;
};

export type APIConceptBelongsToConceptItem = {
   __typename?: 'ConceptBelongsToConceptItem';
  concept: APIConcept;
  relationship: APIConceptBelongsToConcept;
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
};

export type APIUpdateConceptPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type APISetConceptKnownPayloadConceptsField = {
  conceptId: Scalars['String'];
  level?: Maybe<Scalars['Float']>;
};

export type APISetConceptKnownPayload = {
  concepts: Array<APISetConceptKnownPayloadConceptsField>;
};

export type APIDeleteConceptResult = {
   __typename?: 'DeleteConceptResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDomain = {
   __typename?: 'Domain';
  _id: Scalars['String'];
  concepts?: Maybe<APIDomainConceptsResults>;
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  name: Scalars['String'];
  parentDomains?: Maybe<Array<APIDomainBelongsToDomainItem>>;
  resources?: Maybe<APIDomainResourcesResults>;
  subDomains?: Maybe<Array<APIDomainBelongsToDomainItem>>;
};


export type APIDomainConceptsArgs = {
  options: APIDomainConceptsOptions;
};


export type APIDomainResourcesArgs = {
  options: APIDomainResourcesOptions;
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

export type APIDomainBelongsToDomainItem = {
   __typename?: 'DomainBelongsToDomainItem';
  domain: APIDomain;
  relationship: APIDomainBelongsToDomain;
};

/** Domain resources */
export enum APIDomainResourcesSortingType {
  Newest = 'newest',
  Recommended = 'recommended'
}

export type APIDomainResourcesFilterOptions = {
  consumedByUser?: Maybe<Scalars['Boolean']>;
  resourceTypeIn?: Maybe<Array<ResourceType>>;
};

export type APIDomainResourcesOptions = {
  filter?: Maybe<APIDomainResourcesFilterOptions>;
  /** pagination: PaginationOptions! # not required yet */
  query?: Maybe<Scalars['String']>;
  sortingType: APIDomainResourcesSortingType;
};

export type APIDomainResourcesResults = {
   __typename?: 'DomainResourcesResults';
  items: Array<APIResource>;
};

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

export type APILearningMaterial = {
  _id: Scalars['String'];
  coveredConcepts?: Maybe<APILearningMaterialCoveredConceptsResults>;
  coveredConceptsByDomain?: Maybe<Array<APILearningMaterialCoveredConceptsByDomainItem>>;
  domains?: Maybe<Array<APIDomain>>;
  rating?: Maybe<Scalars['Float']>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningMaterialCoveredConceptsArgs = {
  options: APILearningMaterialCoveredConceptsOptions;
};

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
  description?: Maybe<Scalars['String']>;
  domains?: Maybe<Array<APIDomain>>;
  durationMs?: Maybe<Scalars['Int']>;
  key: Scalars['String'];
  name: Scalars['String'];
  rating?: Maybe<Scalars['Float']>;
  resourceItems?: Maybe<Array<APILearningPathResourceItem>>;
  tags?: Maybe<Array<APILearningMaterialTag>>;
};


export type APILearningPathCoveredConceptsArgs = {
  options: APILearningMaterialCoveredConceptsOptions;
};

export type APILearningPathResourceItem = {
   __typename?: 'LearningPathResourceItem';
  description?: Maybe<Scalars['String']>;
  learningPathId: Scalars['String'];
  resource: APIResource;
};

export type APICreateLearningPathPayload = {
  description?: Maybe<Scalars['String']>;
  durationMs?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
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
  durationMs?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  resourceItems?: Maybe<Array<APICreateLearningPathResourceItem>>;
};

export { ResourceMediaType };

export { ResourceType };

export type APIConsumedResource = {
   __typename?: 'ConsumedResource';
  consumedAt?: Maybe<Scalars['Date']>;
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
  durationMs?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  nextResource?: Maybe<APIResource>;
  parentResources?: Maybe<Array<APIResource>>;
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

export type APICreateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  durationMs?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
  type: ResourceType;
  url: Scalars['String'];
};

export type APIUpdateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  durationMs?: Maybe<Scalars['Int']>;
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

export { UserRole };

export type APIUser = {
   __typename?: 'User';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  role: UserRole;
};


export type APIUserArticlesArgs = {
  options: APIListArticlesOptions;
};

export type APIUserLearningPathsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APICurrentUser = {
   __typename?: 'CurrentUser';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  /** private stuff here */
  createdLearningPaths?: Maybe<Array<APILearningPath>>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  role: UserRole;
};


export type APICurrentUserArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APICurrentUserCreatedLearningPathsArgs = {
  options: APIUserLearningPathsOptions;
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
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
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


export type APIUpdateConceptBelongsToConceptPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIConceptBelongsToDomain = {
   __typename?: 'ConceptBelongsToDomain';
  index: Scalars['Float'];
};

export type APIUpdateConceptBelongsToDomainPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type APIConceptReferencesConcept = {
   __typename?: 'ConceptReferencesConcept';
  strength: Scalars['Float'];
};

export type APIConceptBelongsToConcept = {
   __typename?: 'ConceptBelongsToConcept';
  index: Scalars['Float'];
};

export type APIDomainBelongsToDomain = {
   __typename?: 'DomainBelongsToDomain';
  index: Scalars['Float'];
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
  KnownConcept: ResolverTypeWrapper<APIKnownConcept>,
  ConceptReferencesConceptItem: ResolverTypeWrapper<APIConceptReferencesConceptItem>,
  ConceptBelongsToConceptItem: ResolverTypeWrapper<APIConceptBelongsToConceptItem>,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: ResolverTypeWrapper<APIConceptCoveredByResourcesResults>,
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  DeleteConceptResult: ResolverTypeWrapper<APIDeleteConceptResult>,
  Domain: ResolverTypeWrapper<APIDomain>,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptsItem: ResolverTypeWrapper<APIDomainConceptsItem>,
  DomainConceptsResults: ResolverTypeWrapper<APIDomainConceptsResults>,
  DomainBelongsToDomainItem: ResolverTypeWrapper<APIDomainBelongsToDomainItem>,
  DomainResourcesSortingType: APIDomainResourcesSortingType,
  DomainResourcesFilterOptions: APIDomainResourcesFilterOptions,
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: ResolverTypeWrapper<APIDomainResourcesResults>,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: ResolverTypeWrapper<APISearchDomainsResult>,
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: ResolverTypeWrapper<APIDeleteDomainResponse>,
  LearningMaterial: APIResolversTypes['LearningPath'] | APIResolversTypes['Resource'],
  LearningMaterialCoveredConceptsOptions: APILearningMaterialCoveredConceptsOptions,
  LearningMaterialCoveredConceptsResults: ResolverTypeWrapper<APILearningMaterialCoveredConceptsResults>,
  LearningMaterialCoveredConceptsByDomainItem: ResolverTypeWrapper<APILearningMaterialCoveredConceptsByDomainItem>,
  LearningMaterialDomainsOptions: APILearningMaterialDomainsOptions,
  LearningMaterialDomainsResults: ResolverTypeWrapper<APILearningMaterialDomainsResults>,
  LearningMaterialTag: ResolverTypeWrapper<APILearningMaterialTag>,
  LearningMaterialTagSearchResult: ResolverTypeWrapper<APILearningMaterialTagSearchResult>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions,
  LearningPath: ResolverTypeWrapper<APILearningPath>,
  LearningPathResourceItem: ResolverTypeWrapper<APILearningPathResourceItem>,
  CreateLearningPathPayload: APICreateLearningPathPayload,
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem,
  DeleteLearningPathResult: ResolverTypeWrapper<APIDeleteLearningPathResult>,
  ComplementaryResourceUpdatedResult: ResolverTypeWrapper<APIComplementaryResourceUpdatedResult>,
  UpdateLearningPathPayload: APIUpdateLearningPathPayload,
  ResourceMediaType: ResourceMediaType,
  ResourceType: ResourceType,
  ConsumedResource: ResolverTypeWrapper<APIConsumedResource>,
  Resource: ResolverTypeWrapper<APIResource>,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: ResolverTypeWrapper<APIResourceDomainsResults>,
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: ResolverTypeWrapper<APIResourceCoveredConceptsResults>,
  ResourceCoveredConceptsByDomainItem: ResolverTypeWrapper<APIResourceCoveredConceptsByDomainItem>,
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
  UserRole: UserRole,
  User: ResolverTypeWrapper<APIUser>,
  UserLearningPathsOptions: APIUserLearningPathsOptions,
  CurrentUser: ResolverTypeWrapper<APICurrentUser>,
  LoginResponse: ResolverTypeWrapper<APILoginResponse>,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  DiscourseSSO: APIDiscourseSso,
  VerifyEmailResponse: ResolverTypeWrapper<APIVerifyEmailResponse>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  UpdateConceptBelongsToConceptPayload: APIUpdateConceptBelongsToConceptPayload,
  ConceptBelongsToDomain: ResolverTypeWrapper<APIConceptBelongsToDomain>,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  PaginationOptions: APIPaginationOptions,
  ConceptReferencesConcept: ResolverTypeWrapper<APIConceptReferencesConcept>,
  ConceptBelongsToConcept: ResolverTypeWrapper<APIConceptBelongsToConcept>,
  DomainBelongsToDomain: ResolverTypeWrapper<APIDomainBelongsToDomain>,
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
  KnownConcept: APIKnownConcept,
  ConceptReferencesConceptItem: APIConceptReferencesConceptItem,
  ConceptBelongsToConceptItem: APIConceptBelongsToConceptItem,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: APIConceptCoveredByResourcesResults,
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  DeleteConceptResult: APIDeleteConceptResult,
  Domain: APIDomain,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptsItem: APIDomainConceptsItem,
  DomainConceptsResults: APIDomainConceptsResults,
  DomainBelongsToDomainItem: APIDomainBelongsToDomainItem,
  DomainResourcesSortingType: APIDomainResourcesSortingType,
  DomainResourcesFilterOptions: APIDomainResourcesFilterOptions,
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: APIDomainResourcesResults,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: APISearchDomainsResult,
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: APIDeleteDomainResponse,
  LearningMaterial: APIResolversParentTypes['LearningPath'] | APIResolversParentTypes['Resource'],
  LearningMaterialCoveredConceptsOptions: APILearningMaterialCoveredConceptsOptions,
  LearningMaterialCoveredConceptsResults: APILearningMaterialCoveredConceptsResults,
  LearningMaterialCoveredConceptsByDomainItem: APILearningMaterialCoveredConceptsByDomainItem,
  LearningMaterialDomainsOptions: APILearningMaterialDomainsOptions,
  LearningMaterialDomainsResults: APILearningMaterialDomainsResults,
  LearningMaterialTag: APILearningMaterialTag,
  LearningMaterialTagSearchResult: APILearningMaterialTagSearchResult,
  Int: Scalars['Int'],
  SearchLearningMaterialTagsOptions: APISearchLearningMaterialTagsOptions,
  LearningPath: APILearningPath,
  LearningPathResourceItem: APILearningPathResourceItem,
  CreateLearningPathPayload: APICreateLearningPathPayload,
  CreateLearningPathResourceItem: APICreateLearningPathResourceItem,
  DeleteLearningPathResult: APIDeleteLearningPathResult,
  ComplementaryResourceUpdatedResult: APIComplementaryResourceUpdatedResult,
  UpdateLearningPathPayload: APIUpdateLearningPathPayload,
  ResourceMediaType: ResourceMediaType,
  ResourceType: ResourceType,
  ConsumedResource: APIConsumedResource,
  Resource: APIResource,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: APIResourceDomainsResults,
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: APIResourceCoveredConceptsResults,
  ResourceCoveredConceptsByDomainItem: APIResourceCoveredConceptsByDomainItem,
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
  UserRole: UserRole,
  User: APIUser,
  UserLearningPathsOptions: APIUserLearningPathsOptions,
  CurrentUser: APICurrentUser,
  LoginResponse: APILoginResponse,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  DiscourseSSO: APIDiscourseSso,
  VerifyEmailResponse: APIVerifyEmailResponse,
  Date: Scalars['Date'],
  UpdateConceptBelongsToConceptPayload: APIUpdateConceptBelongsToConceptPayload,
  ConceptBelongsToDomain: APIConceptBelongsToDomain,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  PaginationOptions: APIPaginationOptions,
  ConceptReferencesConcept: APIConceptReferencesConcept,
  ConceptBelongsToConcept: APIConceptBelongsToConcept,
  DomainBelongsToDomain: APIDomainBelongsToDomain,
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
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>,
  getArticleByKey?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleByKeyArgs, 'key'>>,
  getConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetConceptArgs, '_id'>>,
  getDomainByKey?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIQueryGetDomainByKeyArgs, 'key'>>,
  getDomainConceptByKey?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetDomainConceptByKeyArgs, 'conceptKey' | 'domainKey'>>,
  getLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathArgs, '_id'>>,
  getLearningPathByKey?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIQueryGetLearningPathByKeyArgs, 'key'>>,
  getResourceById?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByIdArgs, 'id'>>,
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  searchDomains?: Resolver<APIResolversTypes['SearchDomainsResult'], ParentType, ContextType, RequireFields<APIQuerySearchDomainsArgs, 'options'>>,
  searchLearningMaterialTags?: Resolver<Array<APIResolversTypes['LearningMaterialTagSearchResult']>, ParentType, ContextType, RequireFields<APIQuerySearchLearningMaterialTagsArgs, 'options'>>,
  searchResources?: Resolver<APIResolversTypes['SearchResourcesResult'], ParentType, ContextType, RequireFields<APIQuerySearchResourcesArgs, 'options' | 'query'>>,
}>;

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  addComplementaryResourceToLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationAddComplementaryResourceToLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  addConceptBelongsToConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationAddConceptBelongsToConceptArgs, 'parentConceptId' | 'subConceptId'>>,
  addConceptReferencesConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationAddConceptReferencesConceptArgs, 'conceptId' | 'referencedConceptId'>>,
  addConceptToDomain?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationAddConceptToDomainArgs, 'domainId' | 'payload'>>,
  addDomainBelongsToDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationAddDomainBelongsToDomainArgs, 'parentDomainId' | 'subDomainId'>>,
  addResourceToDomain?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAddResourceToDomainArgs, 'domainId' | 'payload'>>,
  addSubResource?: Resolver<APIResolversTypes['SubResourceCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceArgs, 'parentResourceId' | 'subResourceId'>>,
  addSubResourceToSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationAddSubResourceToSeriesArgs, 'parentResourceId' | 'previousResourceId' | 'subResourceId'>>,
  addTagsToLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAddTagsToLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>,
  attachLearningMaterialCoversConcepts?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialCoversConceptsArgs, 'conceptIds' | 'learningMaterialId'>>,
  attachLearningMaterialToDomain?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationAttachLearningMaterialToDomainArgs, 'domainId' | 'learningMaterialId'>>,
  attachResourceCoversConcepts?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAttachResourceCoversConceptsArgs, 'conceptIds' | 'resourceId'>>,
  attachResourceToDomain?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAttachResourceToDomainArgs, 'domainId' | 'resourceId'>>,
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>,
  createDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationCreateDomainArgs, 'payload'>>,
  createLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationCreateLearningPathArgs, 'payload'>>,
  createResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationCreateResourceArgs, 'payload'>>,
  createSubResourceSeries?: Resolver<APIResolversTypes['SubResourceSeriesCreatedResult'], ParentType, ContextType, RequireFields<APIMutationCreateSubResourceSeriesArgs, 'parentResourceId' | 'subResourceId'>>,
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>,
  deleteConcept?: Resolver<APIResolversTypes['DeleteConceptResult'], ParentType, ContextType, RequireFields<APIMutationDeleteConceptArgs, '_id'>>,
  deleteDomain?: Resolver<APIResolversTypes['DeleteDomainResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteDomainArgs, 'id'>>,
  deleteLearningPath?: Resolver<APIResolversTypes['DeleteLearningPathResult'], ParentType, ContextType, RequireFields<APIMutationDeleteLearningPathArgs, '_id'>>,
  deleteResource?: Resolver<APIResolversTypes['DeleteResourceResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteResourceArgs, '_id'>>,
  detachLearningMaterialCoversConcepts?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialCoversConceptsArgs, 'conceptIds' | 'learningMaterialId'>>,
  detachLearningMaterialFromDomain?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationDetachLearningMaterialFromDomainArgs, 'domainId' | 'learningMaterialId'>>,
  detachResourceCoversConcepts?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationDetachResourceCoversConceptsArgs, 'conceptIds' | 'resourceId'>>,
  detachResourceFromDomain?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationDetachResourceFromDomainArgs, 'domainId' | 'resourceId'>>,
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  loginGoogle?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginGoogleArgs, 'idToken'>>,
  rateLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRateLearningMaterialArgs, 'learningMaterialId' | 'value'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
  registerGoogle?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterGoogleArgs, 'payload'>>,
  removeComplementaryResourceFromLearningPath?: Resolver<APIResolversTypes['ComplementaryResourceUpdatedResult'], ParentType, ContextType, RequireFields<APIMutationRemoveComplementaryResourceFromLearningPathArgs, 'learningPathId' | 'resourceId'>>,
  removeConceptBelongsToConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationRemoveConceptBelongsToConceptArgs, 'parentConceptId' | 'subConceptId'>>,
  removeConceptReferencesConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationRemoveConceptReferencesConceptArgs, 'conceptId' | 'referencedConceptId'>>,
  removeDomainBelongsToDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationRemoveDomainBelongsToDomainArgs, 'parentDomainId' | 'subDomainId'>>,
  removeTagsFromLearningMaterial?: Resolver<APIResolversTypes['LearningMaterial'], ParentType, ContextType, RequireFields<APIMutationRemoveTagsFromLearningMaterialArgs, 'learningMaterialId' | 'tags'>>,
  setConceptsKnown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsKnownArgs, 'payload'>>,
  setConceptsUnknown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsUnknownArgs, 'conceptIds'>>,
  setResourcesConsumed?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType, RequireFields<APIMutationSetResourcesConsumedArgs, 'payload'>>,
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>,
  updateConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptArgs, '_id' | 'payload'>>,
  updateConceptBelongsToConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptBelongsToConceptArgs, 'parentConceptId' | 'subConceptId' | 'payload'>>,
  updateConceptBelongsToDomain?: Resolver<APIResolversTypes['ConceptBelongsToDomain'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptBelongsToDomainArgs, 'conceptId' | 'domainId' | 'payload'>>,
  updateDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationUpdateDomainArgs, 'id' | 'payload'>>,
  updateLearningPath?: Resolver<APIResolversTypes['LearningPath'], ParentType, ContextType, RequireFields<APIMutationUpdateLearningPathArgs, '_id' | 'payload'>>,
  updateResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationUpdateResourceArgs, '_id' | 'payload'>>,
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
  parentConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptBelongsToConceptItem']>>, ParentType, ContextType>,
  referencedByConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptReferencesConceptItem']>>, ParentType, ContextType>,
  referencingConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptReferencesConceptItem']>>, ParentType, ContextType>,
  subConcepts?: Resolver<Maybe<Array<APIResolversTypes['ConceptBelongsToConceptItem']>>, ParentType, ContextType>,
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

export type APIConceptBelongsToConceptItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptBelongsToConceptItem'] = APIResolversParentTypes['ConceptBelongsToConceptItem']> = ResolversObject<{
  concept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType>,
  relationship?: Resolver<APIResolversTypes['ConceptBelongsToConcept'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptCoveredByResourcesResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptCoveredByResourcesResults'] = APIResolversParentTypes['ConceptCoveredByResourcesResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteConceptResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteConceptResult'] = APIResolversParentTypes['DeleteConceptResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Domain'] = APIResolversParentTypes['Domain']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  concepts?: Resolver<Maybe<APIResolversTypes['DomainConceptsResults']>, ParentType, ContextType, RequireFields<APIDomainConceptsArgs, 'options'>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  parentDomains?: Resolver<Maybe<Array<APIResolversTypes['DomainBelongsToDomainItem']>>, ParentType, ContextType>,
  resources?: Resolver<Maybe<APIResolversTypes['DomainResourcesResults']>, ParentType, ContextType, RequireFields<APIDomainResourcesArgs, 'options'>>,
  subDomains?: Resolver<Maybe<Array<APIResolversTypes['DomainBelongsToDomainItem']>>, ParentType, ContextType>,
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

export type APIDomainBelongsToDomainItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainBelongsToDomainItem'] = APIResolversParentTypes['DomainBelongsToDomainItem']> = ResolversObject<{
  domain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType>,
  relationship?: Resolver<APIResolversTypes['DomainBelongsToDomain'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainResourcesResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainResourcesResults'] = APIResolversParentTypes['DomainResourcesResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
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

export type APILearningMaterialResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningMaterial'] = APIResolversParentTypes['LearningMaterial']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LearningPath' | 'Resource', ParentType, ContextType>,
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  coveredConcepts?: Resolver<Maybe<APIResolversTypes['LearningMaterialCoveredConceptsResults']>, ParentType, ContextType, RequireFields<APILearningMaterialCoveredConceptsArgs, 'options'>>,
  coveredConceptsByDomain?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialCoveredConceptsByDomainItem']>>, ParentType, ContextType>,
  domains?: Resolver<Maybe<Array<APIResolversTypes['Domain']>>, ParentType, ContextType>,
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
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domains?: Resolver<Maybe<Array<APIResolversTypes['Domain']>>, ParentType, ContextType>,
  durationMs?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  rating?: Resolver<Maybe<APIResolversTypes['Float']>, ParentType, ContextType>,
  resourceItems?: Resolver<Maybe<Array<APIResolversTypes['LearningPathResourceItem']>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['LearningMaterialTag']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILearningPathResourceItemResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LearningPathResourceItem'] = APIResolversParentTypes['LearningPathResourceItem']> = ResolversObject<{
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  learningPathId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  resource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType>,
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

export type APIConsumedResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConsumedResource'] = APIResolversParentTypes['ConsumedResource']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
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
  durationMs?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<APIResolversTypes['ResourceMediaType'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  nextResource?: Resolver<Maybe<APIResolversTypes['Resource']>, ParentType, ContextType>,
  parentResources?: Resolver<Maybe<Array<APIResolversTypes['Resource']>>, ParentType, ContextType>,
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

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APIUserArticlesArgs, 'options'>>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APICurrentUserArticlesArgs, 'options'>>,
  createdLearningPaths?: Resolver<Maybe<Array<APIResolversTypes['LearningPath']>>, ParentType, ContextType, RequireFields<APICurrentUserCreatedLearningPathsArgs, 'options'>>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
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

export interface APIDateScalarConfig extends GraphQLScalarTypeConfig<APIResolversTypes['Date'], any> {
  name: 'Date'
}

export type APIConceptBelongsToDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptBelongsToDomain'] = APIResolversParentTypes['ConceptBelongsToDomain']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptReferencesConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptReferencesConcept'] = APIResolversParentTypes['ConceptReferencesConcept']> = ResolversObject<{
  strength?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptBelongsToConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptBelongsToConcept'] = APIResolversParentTypes['ConceptBelongsToConcept']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDomainBelongsToDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DomainBelongsToDomain'] = APIResolversParentTypes['DomainBelongsToDomain']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
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
  ConceptBelongsToConceptItem?: APIConceptBelongsToConceptItemResolvers<ContextType>,
  ConceptCoveredByResourcesResults?: APIConceptCoveredByResourcesResultsResolvers<ContextType>,
  DeleteConceptResult?: APIDeleteConceptResultResolvers<ContextType>,
  Domain?: APIDomainResolvers<ContextType>,
  DomainConceptsItem?: APIDomainConceptsItemResolvers<ContextType>,
  DomainConceptsResults?: APIDomainConceptsResultsResolvers<ContextType>,
  DomainBelongsToDomainItem?: APIDomainBelongsToDomainItemResolvers<ContextType>,
  DomainResourcesResults?: APIDomainResourcesResultsResolvers<ContextType>,
  SearchDomainsResult?: APISearchDomainsResultResolvers<ContextType>,
  DeleteDomainResponse?: APIDeleteDomainResponseResolvers<ContextType>,
  LearningMaterial?: APILearningMaterialResolvers,
  LearningMaterialCoveredConceptsResults?: APILearningMaterialCoveredConceptsResultsResolvers<ContextType>,
  LearningMaterialCoveredConceptsByDomainItem?: APILearningMaterialCoveredConceptsByDomainItemResolvers<ContextType>,
  LearningMaterialDomainsResults?: APILearningMaterialDomainsResultsResolvers<ContextType>,
  LearningMaterialTag?: APILearningMaterialTagResolvers<ContextType>,
  LearningMaterialTagSearchResult?: APILearningMaterialTagSearchResultResolvers<ContextType>,
  LearningPath?: APILearningPathResolvers<ContextType>,
  LearningPathResourceItem?: APILearningPathResourceItemResolvers<ContextType>,
  DeleteLearningPathResult?: APIDeleteLearningPathResultResolvers<ContextType>,
  ComplementaryResourceUpdatedResult?: APIComplementaryResourceUpdatedResultResolvers<ContextType>,
  ConsumedResource?: APIConsumedResourceResolvers<ContextType>,
  Resource?: APIResourceResolvers<ContextType>,
  ResourceDomainsResults?: APIResourceDomainsResultsResolvers<ContextType>,
  ResourceCoveredConceptsResults?: APIResourceCoveredConceptsResultsResolvers<ContextType>,
  ResourceCoveredConceptsByDomainItem?: APIResourceCoveredConceptsByDomainItemResolvers<ContextType>,
  DeleteResourceResponse?: APIDeleteResourceResponseResolvers<ContextType>,
  SubResourceCreatedResult?: APISubResourceCreatedResultResolvers<ContextType>,
  SubResourceSeriesCreatedResult?: APISubResourceSeriesCreatedResultResolvers<ContextType>,
  SearchResourcesResult?: APISearchResourcesResultResolvers<ContextType>,
  User?: APIUserResolvers<ContextType>,
  CurrentUser?: APICurrentUserResolvers<ContextType>,
  LoginResponse?: APILoginResponseResolvers<ContextType>,
  VerifyEmailResponse?: APIVerifyEmailResponseResolvers<ContextType>,
  Date?: GraphQLScalarType,
  ConceptBelongsToDomain?: APIConceptBelongsToDomainResolvers<ContextType>,
  ConceptReferencesConcept?: APIConceptReferencesConceptResolvers<ContextType>,
  ConceptBelongsToConcept?: APIConceptBelongsToConceptResolvers<ContextType>,
  DomainBelongsToDomain?: APIDomainBelongsToDomainResolvers<ContextType>,
}>;


