import { makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';

import { APIContext } from './server';
import { APIResolvers } from './schema/types';
import { loginResolver, signupResolver } from './resolvers/users.resolvers';

export const typeDefs = importSchema('./src/api/schema/schema.graphql');

const resolvers: APIResolvers<APIContext> = {
  Mutation: {
    login: loginResolver,
    signup: signupResolver,
  },
  Query: {
    currentUser: async (a, b, { user }) => {
      if (!!user) return user;
      throw new Error();
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
