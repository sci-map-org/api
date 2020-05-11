import { app } from './api/server';
import { env } from './env';

process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection');
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.log('uncaughtException');
  console.error(reason);
});
const port = Number(env.api.PORT) || 8080;
app.listen(port);

console.log(`Server running on http://localhost:${port}`);
