import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';

import { schema } from '../api/schema';
import { validateAndDecodeJWT } from '../services/auth/jwt';

export interface APIContext {
  user?: {
    _id: string;
    email: string;
  };
}

const server = new ApolloServer({
  schema,
  introspection: true,
  mocks: process.env.GRAPHQL_MOCK_ENABLED === 'true' && {
    Date: () => new Date(),
  },
  mockEntireSchema: true,
  context: async (context): Promise<APIContext> => {
    const jwt = context.ctx.request.header.authorization;
    if (!!jwt) {
      return { user: await validateAndDecodeJWT(jwt) };
    }
    return {};
  },
});

const app = new Koa();

server.applyMiddleware({ app });

export { app };
