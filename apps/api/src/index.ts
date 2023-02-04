import { getConfig } from './config/config';
import { fastify } from './server';

async function startServer() {
  try {
    const address = await fastify.listen({ port: getConfig('PORT') });
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
