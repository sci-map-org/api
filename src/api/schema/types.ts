import { ArticleContentType } from '../../entities/Article';
import { UserRole } from '../../entities/User';
import { GraphQLResolveInfo } from 'graphql';
import { APIContext } from '../server';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type APIAdminUpdateUserPayload = {
  displayName?: Maybe<Scalars['String']>,
  key?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  role?: Maybe<UserRole>,
};

export type APIArticle = {
   __typename?: 'Article',
  _id: Scalars['String'],
  key: Scalars['String'],
  contentType: ArticleContentType,
  title: Scalars['String'],
  content: Scalars['String'],
  author?: Maybe<APIUser>,
};

export { ArticleContentType };

export type APIConcept = {
   __typename?: 'Concept',
  _id: Scalars['String'],
  name: Scalars['String'],
};

export type APICreateArticlePayload = {
  contentType: ArticleContentType,
  title: Scalars['String'],
  content: Scalars['String'],
};

export type APICreateDomainPayload = {
  name: Scalars['String'],
  key: Scalars['String'],
};

export type APICurrentUser = {
   __typename?: 'CurrentUser',
  _id: Scalars['String'],
  email: Scalars['String'],
  displayName: Scalars['String'],
  key: Scalars['String'],
  role: UserRole,
  articles?: Maybe<APIListArticlesResult>,
};


export type APICurrentUserArticlesArgs = {
  options: APIListArticlesOptions
};

export type APIDeleteArticleResponse = {
   __typename?: 'DeleteArticleResponse',
  _id: Scalars['String'],
  success: Scalars['Boolean'],
};

export type APIDeleteDomainResponse = {
   __typename?: 'DeleteDomainResponse',
  _id: Scalars['String'],
  success: Scalars['Boolean'],
};

export type APIDomain = {
   __typename?: 'Domain',
  _id: Scalars['String'],
  name: Scalars['String'],
  key: Scalars['String'],
};

export type APIListArticlesFilter = {
  contentType?: Maybe<ArticleContentType>,
};

export type APIListArticlesOptions = {
  filter?: Maybe<APIListArticlesFilter>,
  pagination?: Maybe<APIPaginationOptions>,
};

export type APIListArticlesResult = {
   __typename?: 'ListArticlesResult',
  items: Array<APIArticle>,
};

export type APIListSubDomainsOptions = {
  pagination?: Maybe<APIPaginationOptions>,
};

export type APILoginResponse = {
   __typename?: 'LoginResponse',
  currentUser: APICurrentUser,
  jwt: Scalars['String'],
};

export type APIMutation = {
   __typename?: 'Mutation',
  createArticle: APIArticle,
  updateArticle: APIArticle,
  deleteArticle: APIDeleteArticleResponse,
  createDomain: APIDomain,
  updateDomain: APIDomain,
  deleteDomain: APIDeleteDomainResponse,
  login: APILoginResponse,
  register: APICurrentUser,
  adminUpdateUser: APIUser,
};


export type APIMutationCreateArticleArgs = {
  payload: APICreateArticlePayload
};


export type APIMutationUpdateArticleArgs = {
  id: Scalars['String'],
  payload: APIUpdateArticlePayload
};


export type APIMutationDeleteArticleArgs = {
  id: Scalars['String']
};


export type APIMutationCreateDomainArgs = {
  payload: APICreateDomainPayload
};


export type APIMutationUpdateDomainArgs = {
  id: Scalars['String'],
  payload: APIUpdateDomainPayload
};


export type APIMutationDeleteDomainArgs = {
  id: Scalars['String']
};


export type APIMutationLoginArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type APIMutationRegisterArgs = {
  payload: APIRegisterPayload
};


export type APIMutationAdminUpdateUserArgs = {
  id: Scalars['String'],
  payload: APIAdminUpdateUserPayload
};

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
};

export type APIQuery = {
   __typename?: 'Query',
  getArticle: APIArticle,
  listArticles: APIListArticlesResult,
  getDomainByKey: APIDomain,
  currentUser: APICurrentUser,
  getUser: APIUser,
};


export type APIQueryGetArticleArgs = {
  key: Scalars['String']
};


export type APIQueryListArticlesArgs = {
  options: APIListArticlesOptions
};


export type APIQueryGetDomainByKeyArgs = {
  key: Scalars['String']
};


export type APIQueryGetUserArgs = {
  key: Scalars['String']
};

export type APIRegisterPayload = {
  displayName: Scalars['String'],
  key: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
};

export type APIResource = {
   __typename?: 'Resource',
  _id: Scalars['String'],
  type: APIResourceType,
};

export enum APIResourceType {
  Video = 'video'
}

export type APIUpdateArticlePayload = {
  title?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['String']>,
};

export type APIUpdateDomainPayload = {
  name?: Maybe<Scalars['String']>,
  key?: Maybe<Scalars['String']>,
};

export type APIUser = {
   __typename?: 'User',
  _id: Scalars['String'],
  email: Scalars['String'],
  displayName: Scalars['String'],
  key: Scalars['String'],
  articles?: Maybe<APIListArticlesResult>,
};


export type APIUserArticlesArgs = {
  options: APIListArticlesOptions
};

export { UserRole };

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => Maybe<TTypes>;

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
  String: ResolverTypeWrapper<Scalars['String']>,
  Article: ResolverTypeWrapper<APIArticle>,
  ArticleContentType: ArticleContentType,
  User: ResolverTypeWrapper<APIUser>,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  PaginationOptions: APIPaginationOptions,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ListArticlesResult: ResolverTypeWrapper<APIListArticlesResult>,
  Domain: ResolverTypeWrapper<APIDomain>,
  CurrentUser: ResolverTypeWrapper<APICurrentUser>,
  UserRole: UserRole,
  Mutation: ResolverTypeWrapper<{}>,
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  DeleteArticleResponse: ResolverTypeWrapper<APIDeleteArticleResponse>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: ResolverTypeWrapper<APIDeleteDomainResponse>,
  LoginResponse: ResolverTypeWrapper<APILoginResponse>,
  RegisterPayload: APIRegisterPayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  Concept: ResolverTypeWrapper<APIConcept>,
  ListSubDomainsOptions: APIListSubDomainsOptions,
  ResourceType: APIResourceType,
  Resource: ResolverTypeWrapper<APIResource>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type APIResolversParentTypes = ResolversObject<{
  Query: {},
  String: Scalars['String'],
  Article: APIArticle,
  ArticleContentType: ArticleContentType,
  User: APIUser,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  PaginationOptions: APIPaginationOptions,
  Int: Scalars['Int'],
  ListArticlesResult: APIListArticlesResult,
  Domain: APIDomain,
  CurrentUser: APICurrentUser,
  UserRole: UserRole,
  Mutation: {},
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  DeleteArticleResponse: APIDeleteArticleResponse,
  Boolean: Scalars['Boolean'],
  CreateDomainPayload: APICreateDomainPayload,
  UpdateDomainPayload: APIUpdateDomainPayload,
  DeleteDomainResponse: APIDeleteDomainResponse,
  LoginResponse: APILoginResponse,
  RegisterPayload: APIRegisterPayload,
  AdminUpdateUserPayload: APIAdminUpdateUserPayload,
  Concept: APIConcept,
  ListSubDomainsOptions: APIListSubDomainsOptions,
  ResourceType: APIResourceType,
  Resource: APIResource,
}>;

export type APIArticleResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Article'] = APIResolversParentTypes['Article']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  contentType?: Resolver<APIResolversTypes['ArticleContentType'], ParentType, ContextType>,
  title?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  content?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  author?: Resolver<Maybe<APIResolversTypes['User']>, ParentType, ContextType>,
}>;

export type APIConceptResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Concept'] = APIResolversParentTypes['Concept']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<APIResolversTypes['UserRole'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APICurrentUserArticlesArgs, 'options'>>,
}>;

export type APIDeleteArticleResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteArticleResponse'] = APIResolversParentTypes['DeleteArticleResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
}>;

export type APIDeleteDomainResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['DeleteDomainResponse'] = APIResolversParentTypes['DeleteDomainResponse']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<APIResolversTypes['Boolean'], ParentType, ContextType>,
}>;

export type APIDomainResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Domain'] = APIResolversParentTypes['Domain']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
}>;

export type APIListArticlesResultResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['ListArticlesResult'] = APIResolversParentTypes['ListArticlesResult']> = ResolversObject<{
  items?: Resolver<Array<APIResolversTypes['Article']>, ParentType, ContextType>,
}>;

export type APILoginResponseResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['LoginResponse'] = APIResolversParentTypes['LoginResponse']> = ResolversObject<{
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  jwt?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
}>;

export type APIMutationResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Mutation'] = APIResolversParentTypes['Mutation']> = ResolversObject<{
  createArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationCreateArticleArgs, 'payload'>>,
  updateArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIMutationUpdateArticleArgs, 'id' | 'payload'>>,
  deleteArticle?: Resolver<APIResolversTypes['DeleteArticleResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteArticleArgs, 'id'>>,
  createDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationCreateDomainArgs, 'payload'>>,
  updateDomain?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIMutationUpdateDomainArgs, 'id' | 'payload'>>,
  deleteDomain?: Resolver<APIResolversTypes['DeleteDomainResponse'], ParentType, ContextType, RequireFields<APIMutationDeleteDomainArgs, 'id'>>,
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
  adminUpdateUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIMutationAdminUpdateUserArgs, 'id' | 'payload'>>,
}>;

export type APIQueryResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Query'] = APIResolversParentTypes['Query']> = ResolversObject<{
  getArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleArgs, 'key'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  getDomainByKey?: Resolver<APIResolversTypes['Domain'], ParentType, ContextType, RequireFields<APIQueryGetDomainByKeyArgs, 'key'>>,
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
  getUser?: Resolver<APIResolversTypes['User'], ParentType, ContextType, RequireFields<APIQueryGetUserArgs, 'key'>>,
}>;

export type APIResourceResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Resource'] = APIResolversParentTypes['Resource']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<APIResolversTypes['ResourceType'], ParentType, ContextType>,
}>;

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  articles?: Resolver<Maybe<APIResolversTypes['ListArticlesResult']>, ParentType, ContextType, RequireFields<APIUserArticlesArgs, 'options'>>,
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  Article?: APIArticleResolvers<ContextType>,
  Concept?: APIConceptResolvers<ContextType>,
  CurrentUser?: APICurrentUserResolvers<ContextType>,
  DeleteArticleResponse?: APIDeleteArticleResponseResolvers<ContextType>,
  DeleteDomainResponse?: APIDeleteDomainResponseResolvers<ContextType>,
  Domain?: APIDomainResolvers<ContextType>,
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>,
  LoginResponse?: APILoginResponseResolvers<ContextType>,
  Mutation?: APIMutationResolvers<ContextType>,
  Query?: APIQueryResolvers<ContextType>,
  Resource?: APIResourceResolvers<ContextType>,
  User?: APIUserResolvers<ContextType>,
}>;


