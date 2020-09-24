import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import { env } from '../env';
import DiscordTransport from 'winston-discord-transport';

const transports: winston.transport[] = [];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
} else {
  transports.push(
    new WinstonCloudWatch({
      level: 'info',
      awsAccessKeyId: env.AWS.ACCESS_KEY_ID,
      awsSecretKey: env.AWS.SECRET_KEY,
      awsRegion: env.AWS.REGION,
      logGroupName: 'sci-map-api',
      logStreamName: 'logs',
    })
  );
  transports.push(
    new WinstonCloudWatch({
      level: 'error',
      awsAccessKeyId: env.AWS.ACCESS_KEY_ID,
      awsSecretKey: env.AWS.SECRET_KEY,
      awsRegion: env.AWS.REGION,
      logGroupName: 'sci-map-api',
      logStreamName: 'errors',
    })
  );
  env.DISCORD.ERRORS_WEBHOOK_URL &&
    transports.push(
      new DiscordTransport({
        webhook: env.DISCORD.ERRORS_WEBHOOK_URL,
        defaultMeta: { service: 'api' },
        level: 'warn',
      })
    );
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});
