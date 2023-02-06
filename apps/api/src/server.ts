import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { getEnvVariable } from './config/config';

export async function startServer() {
  const fastify = Fastify({
    logger: getEnvVariable('NODE_ENV') !== 'test',
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(import('@fastify/sensible'));

  await fastify.register(import('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: {
      info: {
        title: `Shopping List API (${getEnvVariable('NODE_ENV')})`,
        version: getEnvVariable('VERSION'),
      },
    },
  });
  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
  });

  await fastify.register(import('./auth/jwt.plugin'));

  await fastify.register(import('./db/db'));

  await fastify.register(import('./auth/auth.routes'));
  await fastify.register(import('./categories/categories.routes'));

  fastify.get('/', { onRequest: [fastify.authenticate] }, () => 'Hello world');

  const address = await fastify.listen({ port: getEnvVariable('PORT') });

  if (getEnvVariable('NODE_ENV') !== 'test') {
    console.log(`Server listening at ${address}`);
  }

  return fastify;
}
