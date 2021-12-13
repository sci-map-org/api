import { ApolloServer, AuthenticationError } from 'apollo-server-koa';
import * as Koa from 'koa';

import { schema } from '../api/schema';
import { validateAndDecodeJWT, JWTPayload } from '../services/auth/jwt';
import { env } from '../env';
import { logger } from '../infra/logger';

export interface APIContext {
  user?: JWTPayload;
}

const server = new ApolloServer({
  schema,
  introspection: true,
  mocks: env.API.GRAPHQL_MOCK_ENABLED === 'true' && {
    Date: () => new Date(),
  },
  formatError: (err) => {
    logger.error(err);
    err.extensions &&
      err.extensions.exception.stacktrace &&
      err.extensions.exception.stacktrace.map((s) => logger.error(s));
    return err;
  },
  mockEntireSchema: true,
  context: async (context): Promise<APIContext> => {
    const jwt = context.ctx.request.header.authorization;
    if (!!jwt) {
      try {
        return { user: await validateAndDecodeJWT(jwt) };
      } catch (err) {
        throw new AuthenticationError('Invalid token');
      }
    }
    return {};
  },
  plugins: [
    {
      requestDidStart: async (c) => {
        const requestStartedAt = Date.now();
        return {
          async willSendResponse(a) {
            logger.info(`Operation ${a.operationName} took ${Date.now() - requestStartedAt}ms`);
          },
        };
      },
    },
  ],
});

const app = new Koa();
const port = Number(env.API.PORT) || 8080;

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port);
  logger.info(`Server running on http://localhost:${port}`);
}

export { startServer };
