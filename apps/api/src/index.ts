import { startServer } from './server';

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
