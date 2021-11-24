import * as typedEnv from '@freighthub/typed-env';
import * as dotenv from 'dotenv';

const NEO4J = typedEnv.envGroup(
  {
    DATABASE_URL: typedEnv.types.NonEmptyString,
    USER: typedEnv.types.NonEmptyString,
    PASSWORD: typedEnv.types.NonEmptyString,
    FULL_TEXT_SEARCH_INDEX_NAME: typedEnv.types.NonEmptyString,
  },
  'NEO4J'
);

const AWS = typedEnv.envGroup(
  {
    ACCESS_KEY_ID: typedEnv.types.NonEmptyString,
    SECRET_KEY: typedEnv.types.NonEmptyString,
    REGION: typedEnv.types.NonEmptyString,
  },
  'AWS'
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

const DISCORD = typedEnv.envGroup(
  {
    BOTS_WEBHOOK_ID: typedEnv.types.OptionalString,
    BOTS_WEBHOOK_TOKEN: typedEnv.types.OptionalString,
    ERRORS_WEBHOOK_URL: typedEnv.types.OptionalString,
  },
  'DISCORD'
);

const HOME = typedEnv.envGroup(
  {
    RECOMMENDED_LEARNING_GOALS_IDS: typedEnv.types.OptionalString,
    RECOMMENDED_LEARNING_PATHS_IDS: typedEnv.types.OptionalString,
  },
  'HOME'
);

const API = typedEnv.envGroup({
  PORT: typedEnv.types.PortNumber,
  GRAPHQL_MOCK_ENABLED: typedEnv.types.Boolean,
});

const OTHER = typedEnv.envGroup({
  FRONTEND_BASE_URL: typedEnv.types.NonEmptyString,
  APIFY_LOCAL_STORAGE_DIR: typedEnv.types.NonEmptyString,
  GOOGLE_APIS_KEY: typedEnv.types.NonEmptyString,
  TOP_LEVEL_DOMAINS_KEYS: typedEnv.types.NonEmptyString, // comma separated // TODO
});

const envSchema = typedEnv.envSchema({
  NEO4J,
  AWS,
  AUTH,
  EMAIL,
  DISCORD,
  HOME,
  API,
  OTHER,
});

dotenv.config();

type Env = typedEnv.TypeOf<typeof envSchema>;

export const env: Env = typedEnv.loadFromEnv(envSchema);
