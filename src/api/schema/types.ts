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
   * import Query.*, Mutation.* from "ResourceTag.graphql"
   * import Query.*, Mutation.* from "Resource.graphql"
   * import Query.*, Mutation.* from "Concept.graphql"
   * import Mutation.* from "./relationships/ConceptBelongsToDomain.graphql"
   */
  Date: Date;
};

export type APIAddConceptToDomainPayload = {
  description?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Float']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type APIAdminUpdateUserPayload = {
  active?: Maybe<Scalars['Boolean']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
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

export type APIConcept = {
   __typename?: 'Concept';
  _id: Scalars['String'];
  coveredByResources?: Maybe<APIConceptCoveredByResourcesResults>;
  description?: Maybe<Scalars['String']>;
  domain?: Maybe<APIDomain>;
  key: Scalars['String'];
  known?: Maybe<APIKnownConcept>;
  name: Scalars['String'];
};


export type APIConceptCoveredByResourcesArgs = {
  options: APIConceptCoveredByResourcesOptions;
};

export type APIConceptBelongsToDomain = {
   __typename?: 'ConceptBelongsToDomain';
  index: Scalars['Float'];
};

export type APIConceptCoveredByResourcesOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIConceptCoveredByResourcesResults = {
   __typename?: 'ConceptCoveredByResourcesResults';
  items: Array<APIResource>;
};

export type APIConsumedResource = {
   __typename?: 'ConsumedResource';
  consumedAt?: Maybe<Scalars['Date']>;
  openedAt?: Maybe<Scalars['Date']>;
};

export type APICreateArticlePayload = {
  content: Scalars['String'];
  contentType: ArticleContentType;
  title: Scalars['String'];
};

export type APICreateDomainPayload = {
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  name: Scalars['String'];
};

export type APICreateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  durationMn?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
  type: ResourceType;
  url: Scalars['String'];
};

export type APICurrentUser = {
   __typename?: 'CurrentUser';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  role: UserRole;
};


export type APICurrentUserArticlesArgs = {
  options: APIListArticlesOptions;
};


export type APIDeleteArticleResponse = {
   __typename?: 'DeleteArticleResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteConceptResult = {
   __typename?: 'DeleteConceptResult';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDeleteDomainResponse = {
   __typename?: 'DeleteDomainResponse';
  _id: Scalars['String'];
  success: Scalars['Boolean'];
};

export type APIDiscourseSso = {
  sig: Scalars['String'];
  sso: Scalars['String'];
};

export type APIDomain = {
   __typename?: 'Domain';
  _id: Scalars['String'];
  concepts?: Maybe<APIDomainConceptsResults>;
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  name: Scalars['String'];
  resources?: Maybe<APIDomainResourcesResults>;
};


export type APIDomainConceptsArgs = {
  options: APIDomainConceptsOptions;
};


export type APIDomainResourcesArgs = {
  options: APIDomainResourcesOptions;
};

export type APIDomainConceptsItem = {
   __typename?: 'DomainConceptsItem';
  concept: APIConcept;
  relationship: APIConceptBelongsToDomain;
};

export type APIDomainConceptsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
  sorting?: Maybe<APIDomainConceptSortingOptions>;
};

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

export type APIDomainConceptsResults = {
   __typename?: 'DomainConceptsResults';
  items: Array<APIDomainConceptsItem>;
};

export type APIDomainResourcesOptions = {
  pagination: APIPaginationOptions;
};

export type APIDomainResourcesResults = {
   __typename?: 'DomainResourcesResults';
  items: Array<APIResource>;
};

export type APIKnownConcept = {
   __typename?: 'KnownConcept';
  level: Scalars['Float'];
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

export type APILoginResponse = {
   __typename?: 'LoginResponse';
  currentUser: APICurrentUser;
  jwt: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
};

export type APIMutation = {
   __typename?: 'Mutation';
  addConceptToDomain: APIConcept;
  addResourceToDomain: APIResource;
  addTagsToResource: APIResource;
  adminUpdateUser: APIUser;
  attachResourceCoversConcepts: APIResource;
  attachResourceToDomain: APIResource;
  createArticle: APIArticle;
  createDomain: APIDomain;
  createResource: APIResource;
  deleteArticle: APIDeleteArticleResponse;
  deleteConcept: APIDeleteConceptResult;
  deleteDomain: APIDeleteDomainResponse;
  detachResourceCoversConcepts: APIResource;
  login: APILoginResponse;
  loginGoogle: APILoginResponse;
  register: APICurrentUser;
  registerGoogle: APICurrentUser;
  removeTagsFromResource: APIResource;
  setConceptsKnown: Array<APIConcept>;
  setConceptsUnknown: Array<APIConcept>;
  setResourcesConsumed: Array<APIResource>;
  updateArticle: APIArticle;
  updateConcept: APIConcept;
  updateConceptBelongsToDomain: APIConceptBelongsToDomain;
  updateDomain: APIDomain;
  updateResource: APIResource;
  verifyEmailAddress: APIVerifyEmailResponse;
  voteResource: APIResource;
};


export type APIMutationAddConceptToDomainArgs = {
  domainId: Scalars['String'];
  payload: APIAddConceptToDomainPayload;
};


export type APIMutationAddResourceToDomainArgs = {
  domainId: Scalars['String'];
  payload: APICreateResourcePayload;
};


export type APIMutationAddTagsToResourceArgs = {
  resourceId: Scalars['String'];
  tags: Array<Scalars['String']>;
};


export type APIMutationAdminUpdateUserArgs = {
  id: Scalars['String'];
  payload: APIAdminUpdateUserPayload;
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


export type APIMutationCreateResourceArgs = {
  payload: APICreateResourcePayload;
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


export type APIMutationDetachResourceCoversConceptsArgs = {
  conceptIds: Array<Scalars['String']>;
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


export type APIMutationRegisterArgs = {
  payload: APIRegisterPayload;
};


export type APIMutationRegisterGoogleArgs = {
  payload: APIRegisterGooglePayload;
};


export type APIMutationRemoveTagsFromResourceArgs = {
  resourceId: Scalars['String'];
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


export type APIMutationUpdateConceptBelongsToDomainArgs = {
  conceptId: Scalars['String'];
  domainId: Scalars['String'];
  payload: APIUpdateConceptBelongsToDomainPayload;
};


export type APIMutationUpdateDomainArgs = {
  id: Scalars['String'];
  payload: APIUpdateDomainPayload;
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

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type APIQuery = {
   __typename?: 'Query';
  currentUser?: Maybe<APICurrentUser>;
  getArticleByKey: APIArticle;
  getConcept: APIConcept;
  getConceptByKey: APIConcept;
  getDomainByKey: APIDomain;
  getResourceById: APIResource;
  getUser: APIUser;
  listArticles: APIListArticlesResult;
  searchDomains: APISearchDomainsResult;
  searchResourceTags: Array<APIResourceTagSearchResult>;
};


export type APIQueryGetArticleByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetConceptArgs = {
  _id: Scalars['String'];
};


export type APIQueryGetConceptByKeyArgs = {
  key: Scalars['String'];
};


export type APIQueryGetDomainByKeyArgs = {
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


export type APIQuerySearchResourceTagsArgs = {
  options: APISearchResourceTagsOptions;
};

export type APIRegisterGooglePayload = {
  displayName: Scalars['String'];
  idToken: Scalars['String'];
  key: Scalars['String'];
};

export type APIRegisterPayload = {
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
  password: Scalars['String'];
};

export type APIResource = {
   __typename?: 'Resource';
  _id: Scalars['String'];
  consumed?: Maybe<APIConsumedResource>;
  coveredConcepts?: Maybe<APIResourceCoveredConceptsResults>;
  description?: Maybe<Scalars['String']>;
  domains?: Maybe<APIResourceDomainsResults>;
  durationMn?: Maybe<Scalars['Int']>;
  mediaType: ResourceMediaType;
  name: Scalars['String'];
  tags?: Maybe<Array<APIResourceTag>>;
  type: ResourceType;
  upvotes?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};


export type APIResourceCoveredConceptsArgs = {
  options: APIResourceCoveredConceptsOptions;
};


export type APIResourceDomainsArgs = {
  options: APIResourceDomainsOptions;
};

export type APIResourceCoveredConceptsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIResourceCoveredConceptsResults = {
   __typename?: 'ResourceCoveredConceptsResults';
  items: Array<APIConcept>;
};

export type APIResourceDomainsOptions = {
  pagination?: Maybe<APIPaginationOptions>;
};

export type APIResourceDomainsResults = {
   __typename?: 'ResourceDomainsResults';
  items: Array<APIDomain>;
};

export { ResourceMediaType };

export type APIResourceTag = {
   __typename?: 'ResourceTag';
  name: Scalars['String'];
};

export type APIResourceTagSearchResult = {
   __typename?: 'ResourceTagSearchResult';
  name: Scalars['String'];
  usageCount?: Maybe<Scalars['Int']>;
};

export { ResourceType };

export enum APIResourceVoteValue {
  Down = 'down',
  Up = 'up'
}

export type APISearchDomainsOptions = {
  pagination: APIPaginationOptions;
  query?: Maybe<Scalars['String']>;
};

export type APISearchDomainsResult = {
   __typename?: 'SearchDomainsResult';
  items: Array<APIDomain>;
};

export type APISearchResourceTagsOptions = {
  pagination: APIPaginationOptions;
  query: Scalars['String'];
};

export type APISetConceptKnownPayload = {
  concepts: Array<APISetConceptKnownPayloadConceptsField>;
};

export type APISetConceptKnownPayloadConceptsField = {
  conceptId: Scalars['String'];
  level?: Maybe<Scalars['Float']>;
};

export type APISetResourcesConsumedPayload = {
  resources: Array<APISetResourcesConsumedPayloadResourcesField>;
};

export type APISetResourcesConsumedPayloadResourcesField = {
  consumed?: Maybe<Scalars['Boolean']>;
  opened?: Maybe<Scalars['Boolean']>;
  resourceId: Scalars['String'];
};

export { SortingDirection };

export type APIUpdateArticlePayload = {
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type APIUpdateConceptBelongsToDomainPayload = {
  index?: Maybe<Scalars['Float']>;
};

export type APIUpdateConceptPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type APIUpdateDomainPayload = {
  description?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type APIUpdateResourcePayload = {
  description?: Maybe<Scalars['String']>;
  durationMn?: Maybe<Scalars['Int']>;
  mediaType?: Maybe<ResourceMediaType>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<ResourceType>;
  url?: Maybe<Scalars['String']>;
};

export type APIUser = {
   __typename?: 'User';
  _id: Scalars['String'];
  articles?: Maybe<APIListArticlesResult>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  key: Scalars['String'];
};


export type APIUserArticlesArgs = {
  options: APIListArticlesOptions;
};

export { UserRole };

export type APIVerifyEmailResponse = {
   __typename?: 'VerifyEmailResponse';
  email: Scalars['String'];
};

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
  Query: ResolverTypeWrapper<{}>,
  CurrentUser: ResolverTypeWrapper<APICurrentUser>,
  String: ResolverTypeWrapper<Scalars['String']>,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  ArticleContentType: ArticleContentType,
  PaginationOptions: APIPaginationOptions,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ListArticlesResult: ResolverTypeWrapper<APIListArticlesResult>,
  Article: ResolverTypeWrapper<APIArticle>,
  User: ResolverTypeWrapper<APIUser>,
  UserRole: UserRole,
  Concept: ResolverTypeWrapper<APIConcept>,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: ResolverTypeWrapper<APIConceptCoveredByResourcesResults>,
  Resource: ResolverTypeWrapper<APIResource>,
  ConsumedResource: ResolverTypeWrapper<APIConsumedResource>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: ResolverTypeWrapper<APIResourceCoveredConceptsResults>,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: ResolverTypeWrapper<APIResourceDomainsResults>,
  Domain: ResolverTypeWrapper<APIDomain>,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  SortingDirection: SortingDirection,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptsResults: ResolverTypeWrapper<APIDomainConceptsResults>,
  DomainConceptsItem: ResolverTypeWrapper<APIDomainConceptsItem>,
  ConceptBelongsToDomain: ResolverTypeWrapper<APIConceptBelongsToDomain>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: ResolverTypeWrapper<APIDomainResourcesResults>,
  ResourceMediaType: ResourceMediaType,
  ResourceTag: ResolverTypeWrapper<APIResourceTag>,
  ResourceType: ResourceType,
  KnownConcept: ResolverTypeWrapper<APIKnownConcept>,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: ResolverTypeWrapper<APISearchDomainsResult>,
  SearchResourceTagsOptions: APISearchResourceTagsOptions,
  ResourceTagSearchResult: ResolverTypeWrapper<APIResourceTagSearchResult>,
  Mutation: ResolverTypeWrapper<{}>,
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  CreateResourcePayload: APICreateResourcePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  CreateArticlePayload: APICreateArticlePayload,
  CreateDomainPayload: APICreateDomainPayload,
  DeleteArticleResponse: ResolverTypeWrapper<APIDeleteArticleResponse>,
  DeleteConceptResult: ResolverTypeWrapper<APIDeleteConceptResult>,
  DeleteDomainResponse: ResolverTypeWrapper<APIDeleteDomainResponse>,
  DiscourseSSO: APIDiscourseSso,
  LoginResponse: ResolverTypeWrapper<APILoginResponse>,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  UpdateArticlePayload: APIUpdateArticlePayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  VerifyEmailResponse: ResolverTypeWrapper<APIVerifyEmailResponse>,
  ResourceVoteValue: APIResourceVoteValue,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type APIResolversParentTypes = ResolversObject<{
  Query: {},
  CurrentUser: APICurrentUser,
  String: Scalars['String'],
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  ArticleContentType: ArticleContentType,
  PaginationOptions: APIPaginationOptions,
  Int: Scalars['Int'],
  ListArticlesResult: APIListArticlesResult,
  Article: APIArticle,
  User: APIUser,
  UserRole: UserRole,
  Concept: APIConcept,
  ConceptCoveredByResourcesOptions: APIConceptCoveredByResourcesOptions,
  ConceptCoveredByResourcesResults: APIConceptCoveredByResourcesResults,
  Resource: APIResource,
  ConsumedResource: APIConsumedResource,
  Date: Scalars['Date'],
  ResourceCoveredConceptsOptions: APIResourceCoveredConceptsOptions,
  ResourceCoveredConceptsResults: APIResourceCoveredConceptsResults,
  ResourceDomainsOptions: APIResourceDomainsOptions,
  ResourceDomainsResults: APIResourceDomainsResults,
  Domain: APIDomain,
  DomainConceptsOptions: APIDomainConceptsOptions,
  DomainConceptSortingOptions: APIDomainConceptSortingOptions,
  SortingDirection: SortingDirection,
  DomainConceptSortingEntities: APIDomainConceptSortingEntities,
  DomainConceptSortingFields: APIDomainConceptSortingFields,
  DomainConceptsResults: APIDomainConceptsResults,
  DomainConceptsItem: APIDomainConceptsItem,
  ConceptBelongsToDomain: APIConceptBelongsToDomain,
  Float: Scalars['Float'],
  DomainResourcesOptions: APIDomainResourcesOptions,
  DomainResourcesResults: APIDomainResourcesResults,
  ResourceMediaType: ResourceMediaType,
  ResourceTag: APIResourceTag,
  ResourceType: ResourceType,
  KnownConcept: APIKnownConcept,
  SearchDomainsOptions: APISearchDomainsOptions,
  SearchDomainsResult: APISearchDomainsResult,
  SearchResourceTagsOptions: APISearchResourceTagsOptions,
  ResourceTagSearchResult: APIResourceTagSearchResult,
  Mutation: {},
  AddConceptToDomainPayload: APIAddConceptToDomainPayload,
  CreateResourcePayload: APICreateResourcePayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  Boolean: Scalars['Boolean'],
  CreateArticlePayload: APICreateArticlePayload,
  CreateDomainPayload: APICreateDomainPayload,
  DeleteArticleResponse: APIDeleteArticleResponse,
  DeleteConceptResult: APIDeleteConceptResult,
  DeleteDomainResponse: APIDeleteDomainResponse,
  DiscourseSSO: APIDiscourseSso,
  LoginResponse: APILoginResponse,
  RegisterPayload: APIRegisterPayload,
  RegisterGooglePayload: APIRegisterGooglePayload,
  SetConceptKnownPayload: APISetConceptKnownPayload,
  SetConceptKnownPayloadConceptsField: APISetConceptKnownPayloadConceptsField,
  SetResourcesConsumedPayload: APISetResourcesConsumedPayload,
  SetResourcesConsumedPayloadResourcesField: APISetResourcesConsumedPayloadResourcesField,
  UpdateArticlePayload: APIUpdateArticlePayload,
  UpdateConceptPayload: APIUpdateConceptPayload,
  UpdateConceptBelongsToDomainPayload: APIUpdateConceptBelongsToDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  UpdateResourcePayload: APIUpdateResourcePayload,
  VerifyEmailResponse: APIVerifyEmailResponse,
  ResourceVoteValue: APIResourceVoteValue,
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

export type APIConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Concept'] = APIResolversParentTypes['Concept']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  coveredByResources?: Resolver<Maybe<APIResolversTypes['ConceptCoveredByResourcesResults']>, ParentType, ContextType, RequireFields<APIConceptCoveredByResourcesArgs, 'options'>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domain?: Resolver<Maybe<APIResolversTypes['Domain']>, ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  known?: Resolver<Maybe<APIResolversTypes['KnownConcept']>, ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptBelongsToDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptBelongsToDomain'] = APIResolversParentTypes['ConceptBelongsToDomain']> = ResolversObject<{
  index?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConceptCoveredByResourcesResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConceptCoveredByResourcesResults'] = APIResolversParentTypes['ConceptCoveredByResourcesResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIConsumedResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ConsumedResource'] = APIResolversParentTypes['ConsumedResource']> = ResolversObject<{
  consumedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  openedAt?: Resolver<Maybe<APIResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APICurrentUserArticlesArgs, 'options'>>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface APIDateScalarConfig extends GraphQLScalarTypeConfig<APIResolversTypes['Date'], any> {
  name: 'Date'
}

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteConceptResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteConceptResult'] = APIResolversParentTypes['DeleteConceptResult']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIDeleteDomainResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteDomainResponse'] = APIResolversParentTypes['DeleteDomainResponse']> = ResolversObject<{
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
  resources?: Resolver<Maybe<APIResolversTypes['DomainResourcesResults']>, ParentType, ContextType, RequireFields<APIDomainResourcesArgs, 'options'>>,
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

export type APIKnownConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['KnownConcept'] = APIResolversParentTypes['KnownConcept']> = ResolversObject<{
  level?: Resolver<APIResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIListArticlesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ListArticlesResult'] = APIResolversParentTypes['ListArticlesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Article']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APILoginResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LoginResponse'] = APIResolversParentTypes['LoginResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  jwt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  redirectUrl?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  addConceptToDomain?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationAddConceptToDomainArgs, 'domainId' | 'payload'>>,
  addResourceToDomain?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAddResourceToDomainArgs, 'domainId' | 'payload'>>,
  addTagsToResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAddTagsToResourceArgs, 'resourceId' | 'tags'>>,
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>,
  attachResourceCoversConcepts?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAttachResourceCoversConceptsArgs, 'conceptIds' | 'resourceId'>>,
  attachResourceToDomain?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationAttachResourceToDomainArgs, 'domainId' | 'resourceId'>>,
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>,
  createDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationCreateDomainArgs, 'payload'>>,
  createResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationCreateResourceArgs, 'payload'>>,
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>,
  deleteConcept?: Resolver<APIResolversTypes['DeleteConceptResult'], ParentType, ContextType, RequireFields<APIMutationDeleteConceptArgs, '_id'>>,
  deleteDomain?: Resolver<APIResolversTypes['DeleteDomainResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteDomainArgs, 'id'>>,
  detachResourceCoversConcepts?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationDetachResourceCoversConceptsArgs, 'conceptIds' | 'resourceId'>>,
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  loginGoogle?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginGoogleArgs, 'idToken'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
  registerGoogle?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterGoogleArgs, 'payload'>>,
  removeTagsFromResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationRemoveTagsFromResourceArgs, 'resourceId' | 'tags'>>,
  setConceptsKnown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsKnownArgs, 'payload'>>,
  setConceptsUnknown?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType, RequireFields<APIMutationSetConceptsUnknownArgs, 'conceptIds'>>,
  setResourcesConsumed?: Resolver<Array<APIResolversTypes['Resource']>, ParentType, ContextType, RequireFields<APIMutationSetResourcesConsumedArgs, 'payload'>>,
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>,
  updateConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptArgs, '_id' | 'payload'>>,
  updateConceptBelongsToDomain?: Resolver<APIResolversTypes['ConceptBelongsToDomain'], ParentType, ContextType, RequireFields<APIMutationUpdateConceptBelongsToDomainArgs, 'conceptId' | 'domainId' | 'payload'>>,
  updateDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationUpdateDomainArgs, 'id' | 'payload'>>,
  updateResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationUpdateResourceArgs, '_id' | 'payload'>>,
  verifyEmailAddress?: Resolver<APIResolversTypes['VerifyEmailResponse'], ParentType, ContextType, RequireFields<APIMutationVerifyEmailAddressArgs, 'token'>>,
  voteResource?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIMutationVoteResourceArgs, 'resourceId' | 'value'>>,
}>;

export type APIQueryResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Query'] = APIResolversParentTypes['Query']> = ResolversObject<{
  currentUser?: Resolver<Maybe<APIResolversTypes['CurrentUser']>, ParentType, ContextType>,
  getArticleByKey?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleByKeyArgs, 'key'>>,
  getConcept?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetConceptArgs, '_id'>>,
  getConceptByKey?: Resolver<APIResolversTypes['Concept'], ParentType, ContextType, RequireFields<APIQueryGetConceptByKeyArgs, 'key'>>,
  getDomainByKey?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIQueryGetDomainByKeyArgs, 'key'>>,
  getResourceById?: Resolver<APIResolversTypes['Resource'], ParentType, ContextType, RequireFields<APIQueryGetResourceByIdArgs, 'id'>>,
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  searchDomains?: Resolver<APIResolversTypes['SearchDomainsResult'], ParentType, ContextType, RequireFields<APIQuerySearchDomainsArgs, 'options'>>,
  searchResourceTags?: Resolver<Array<APIResolversTypes['ResourceTagSearchResult']>, ParentType, ContextType, RequireFields<APIQuerySearchResourceTagsArgs, 'options'>>,
}>;

export type APIResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Resource'] = APIResolversParentTypes['Resource']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  consumed?: Resolver<Maybe<APIResolversTypes['ConsumedResource']>, ParentType, ContextType>,
  coveredConcepts?: Resolver<Maybe<APIResolversTypes['ResourceCoveredConceptsResults']>, ParentType, ContextType, RequireFields<APIResourceCoveredConceptsArgs, 'options'>>,
  description?: Resolver<Maybe<APIResolversTypes['String']>, ParentType, ContextType>,
  domains?: Resolver<Maybe<APIResolversTypes['ResourceDomainsResults']>, ParentType, ContextType, RequireFields<APIResourceDomainsArgs, 'options'>>,
  durationMn?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  mediaType?: Resolver<APIResolversTypes['ResourceMediaType'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<APIResolversTypes['ResourceTag']>>, ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['ResourceType'], ParentType, ContextType>,
  upvotes?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  url?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceCoveredConceptsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceCoveredConceptsResults'] = APIResolversParentTypes['ResourceCoveredConceptsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Concept']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceDomainsResultsResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceDomainsResults'] = APIResolversParentTypes['ResourceDomainsResults']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceTagResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceTag'] = APIResolversParentTypes['ResourceTag']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResourceTagSearchResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ResourceTagSearchResult'] = APIResolversParentTypes['ResourceTagSearchResult']> = ResolversObject<{
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  usageCount?: Resolver<Maybe<APIResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APISearchDomainsResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['SearchDomainsResult'] = APIResolversParentTypes['SearchDomainsResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Domain']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APIUserArticlesArgs, 'options'>>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIVerifyEmailResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['VerifyEmailResponse'] = APIResolversParentTypes['VerifyEmailResponse']> = ResolversObject<{
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  Article?: APIArticleResolvers<ContextType>,
  Concept?: APIConceptResolvers<ContextType>,
  ConceptBelongsToDomain?: APIConceptBelongsToDomainResolvers<ContextType>,
  ConceptCoveredByResourcesResults?: APIConceptCoveredByResourcesResultsResolvers<ContextType>,
  ConsumedResource?: APIConsumedResourceResolvers<ContextType>,
  CurrentUser?: APICurrentUserResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DeleteArticleResponse?: APIDeleteArticleResponseResolvers<ContextType>,
  DeleteConceptResult?: APIDeleteConceptResultResolvers<ContextType>,
  DeleteDomainResponse?: APIDeleteDomainResponseResolvers<ContextType>,
  Domain?: APIDomainResolvers<ContextType>,
  DomainConceptsItem?: APIDomainConceptsItemResolvers<ContextType>,
  DomainConceptsResults?: APIDomainConceptsResultsResolvers<ContextType>,
  DomainResourcesResults?: APIDomainResourcesResultsResolvers<ContextType>,
  KnownConcept?: APIKnownConceptResolvers<ContextType>,
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>,
  LoginResponse?: APILoginResponseResolvers<ContextType>,
  Mutation?: APIMutationResolvers<ContextType>,
  Query?: APIQueryResolvers<ContextType>,
  Resource?: APIResourceResolvers<ContextType>,
  ResourceCoveredConceptsResults?: APIResourceCoveredConceptsResultsResolvers<ContextType>,
  ResourceDomainsResults?: APIResourceDomainsResultsResolvers<ContextType>,
  ResourceTag?: APIResourceTagResolvers<ContextType>,
  ResourceTagSearchResult?: APIResourceTagSearchResultResolvers<ContextType>,
  SearchDomainsResult?: APISearchDomainsResultResolvers<ContextType>,
  User?: APIUserResolvers<ContextType>,
  VerifyEmailResponse?: APIVerifyEmailResponseResolvers<ContextType>,
}>;


