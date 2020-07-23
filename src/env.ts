import * as typedEnv from '@freighthub/typed-env';
import * as dotenv from 'dotenv';

const NEO4J = typedEnv.envGroup(
  {
    DATABASE_URL: typedEnv.types.NonEmptyString,
    USER: typedEnv.types.NonEmptyString,
    PASSWORD: typedEnv.types.NonEmptyString,
  },
  'NEO4J'
);

const AUTH = typedEnv.envGroup(
  {
    GOOGLE_CLIENT_ID: typedEnv.types.NonEmptyString,
    DISCOURSE_SSO_SECRET: typedEnv.types.NonEmptyString,
  },
  'AUTH'
);

const API = typedEnv.envGroup({
  PORT: typedEnv.types.PortNumber,
  GRAPHQL_MOCK_ENABLED: typedEnv.types.Boolean,
});

const envSchema = typedEnv.envSchema({
  NEO4J,
  AUTH,
  API,
});

dotenv.config();

type Env = typedEnv.TypeOf<typeof envSchema>;

export const env: Env = typedEnv.loadFromEnv(envSchema);
