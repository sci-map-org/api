import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';

import { APIContext } from './server';
import { APIResolvers } from './schema/types';
import { loginResolver, registerResolver, currentUserResolver } from './resolvers/users.resolvers';

export const typeDefs = importSchema('./src/api/schema/schema.graphql');

const resolvers: APIResolvers<APIContext> = {
  Mutation: {
    login: loginResolver,
    register: registerResolver,
  },
  Query: {
    currentUser: currentUserResolver,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
