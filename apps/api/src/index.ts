import { getEnvVariable } from './config/config';
import { createServer } from './server';

async function startServer() {
  const fastify = await createServer();
  try {
    const address = await fastify.listen({ port: getEnvVariable('PORT') });
    console.log(`Server listening at ${address}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
