import { ArticleContentType } from '../../repositories/articles.repository';
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

export type APIArticle = {
   __typename?: 'Article',
  _id: Scalars['String'],
  key: Scalars['String'],
  contentType: ArticleContentType,
  title: Scalars['String'],
  content: Scalars['String'],
  authorId: Scalars['String'],
};

export { ArticleContentType };

export type APICreateArticlePayload = {
  contentType: ArticleContentType,
  title: Scalars['String'],
  content: Scalars['String'],
};

export type APICurrentUser = {
   __typename?: 'CurrentUser',
  _id: Scalars['String'],
  email: Scalars['String'],
  displayName: Scalars['String'],
  key: Scalars['String'],
};

export type APIListArticlesFilter = {
  authorId?: Maybe<Scalars['String']>,
};

export type APIListArticlesOptions = {
  filter?: Maybe<APIListArticlesFilter>,
  pagination?: Maybe<APIPaginationOptions>,
};

export type APIListArticlesResult = {
   __typename?: 'ListArticlesResult',
  items: Array<APIArticle>,
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
  login: APILoginResponse,
  register: APICurrentUser,
};


export type APIMutationCreateArticleArgs = {
  payload: APICreateArticlePayload
};


export type APIMutationUpdateArticleArgs = {
  id: Scalars['String'],
  payload: APIUpdateArticlePayload
};


export type APIMutationLoginArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type APIMutationRegisterArgs = {
  payload: APIRegisterPayload
};

export type APIPaginationOptions = {
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
};

export type APIQuery = {
   __typename?: 'Query',
  getArticle: APIArticle,
  listArticles: APIListArticlesResult,
  currentUser: APICurrentUser,
};


export type APIQueryGetArticleArgs = {
  key: Scalars['String']
};


export type APIQueryListArticlesArgs = {
  options: APIListArticlesOptions
};

export type APIRegisterPayload = {
  displayName: Scalars['String'],
  key: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
};

export type APIUpdateArticlePayload = {
  title?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['String']>,
};

export type APIUser = {
   __typename?: 'User',
  _id: Scalars['String'],
  email: Scalars['String'],
  displayName: Scalars['String'],
  key: Scalars['String'],
};

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
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  PaginationOptions: APIPaginationOptions,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ListArticlesResult: ResolverTypeWrapper<APIListArticlesResult>,
  CurrentUser: ResolverTypeWrapper<APICurrentUser>,
  Mutation: ResolverTypeWrapper<{}>,
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  LoginResponse: ResolverTypeWrapper<APILoginResponse>,
  RegisterPayload: APIRegisterPayload,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  User: ResolverTypeWrapper<APIUser>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type APIResolversParentTypes = ResolversObject<{
  Query: {},
  String: Scalars['String'],
  Article: APIArticle,
  ArticleContentType: ArticleContentType,
  ListArticlesOptions: APIListArticlesOptions,
  ListArticlesFilter: APIListArticlesFilter,
  PaginationOptions: APIPaginationOptions,
  Int: Scalars['Int'],
  ListArticlesResult: APIListArticlesResult,
  CurrentUser: APICurrentUser,
  Mutation: {},
  CreateArticlePayload: APICreateArticlePayload,
  UpdateArticlePayload: APIUpdateArticlePayload,
  LoginResponse: APILoginResponse,
  RegisterPayload: APIRegisterPayload,
  Boolean: Scalars['Boolean'],
  User: APIUser,
}>;

export type APIArticleResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Article'] = APIResolversParentTypes['Article']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  contentType?: Resolver<APIResolversTypes['ArticleContentType'], ParentType, ContextType>,
  title?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  content?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  authorId?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
}>;

export type APICurrentUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['CurrentUser'] = APIResolversParentTypes['CurrentUser']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
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
  login?: Resolver<APIResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<APIMutationLoginArgs, 'email' | 'password'>>,
  register?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType, RequireFields<APIMutationRegisterArgs, 'payload'>>,
}>;

export type APIQueryResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['Query'] = APIResolversParentTypes['Query']> = ResolversObject<{
  getArticle?: Resolver<APIResolversTypes['Article'], ParentType, ContextType, RequireFields<APIQueryGetArticleArgs, 'key'>>,
  listArticles?: Resolver<APIResolversTypes['ListArticlesResult'], ParentType, ContextType, RequireFields<APIQueryListArticlesArgs, 'options'>>,
  currentUser?: Resolver<APIResolversTypes['CurrentUser'], ParentType, ContextType>,
}>;

export type APIUserResolvers<ContextType = APIContext, ParentType extends APIResolversParentTypes['User'] = APIResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  displayName?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
  key?: Resolver<APIResolversTypes['String'], ParentType, ContextType>,
}>;

export type APIResolvers<ContextType = APIContext> = ResolversObject<{
  Article?: APIArticleResolvers<ContextType>,
  CurrentUser?: APICurrentUserResolvers<ContextType>,
  ListArticlesResult?: APIListArticlesResultResolvers<ContextType>,
  LoginResponse?: APILoginResponseResolvers<ContextType>,
  Mutation?: APIMutationResolvers<ContextType>,
  Query?: APIQueryResolvers<ContextType>,
  User?: APIUserResolvers<ContextType>,
}>;


