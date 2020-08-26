import { app } from './api/server';
import { env } from './env';
import { logger } from './infra/logger';

process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection');
  logger.error(reason);
});

process.on('uncaughtException', reason => {
  logger.error('uncaughtException');
  logger.error(reason);
});
const port = Number(env.API.PORT) || 8080;
app.listen(port);

logger.info(`Server running on http://localhost:${port}`);
