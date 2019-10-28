import { app } from './api/server';

process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection');
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.log('uncaughtException');
  console.error(reason);
});

app.listen(8000);

console.log('Server running on http://localhost:8000');
