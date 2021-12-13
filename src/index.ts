import { startServer } from './api/server';
import { logger } from './infra/logger';

process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection');
  logger.error(reason);
});

process.on('uncaughtException', reason => {
  logger.error('uncaughtException');
  logger.error(reason);
});

startServer();
