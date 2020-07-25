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
    JWT_SECRET: typedEnv.types.NonEmptyString,
    GOOGLE_CLIENT_ID: typedEnv.types.NonEmptyString,
    DISCOURSE_SSO_SECRET: typedEnv.types.NonEmptyString,
    EMAIL_JWT_SECRET: typedEnv.types.NonEmptyString,
  },
  'AUTH'
);

const EMAIL = typedEnv.envGroup(
  {
    SMTP_SERVER_NAME: typedEnv.types.NonEmptyString,
    SMTP_PORT: typedEnv.types.PortNumber,
    SMTP_USERNAME: typedEnv.types.NonEmptyString,
    SMPT_PASSWORD: typedEnv.types.NonEmptyString,
  },
  'EMAIL'
);

const API = typedEnv.envGroup({
  PORT: typedEnv.types.PortNumber,
  GRAPHQL_MOCK_ENABLED: typedEnv.types.Boolean,
});

const OTHER = typedEnv.envGroup({
  FRONTEND_BASE_URL: typedEnv.types.NonEmptyString,
});

const envSchema = typedEnv.envSchema({
  NEO4J,
  AUTH,
  EMAIL,
  API,
  OTHER,
});

dotenv.config();

type Env = typedEnv.TypeOf<typeof envSchema>;

export const env: Env = typedEnv.loadFromEnv(envSchema);
