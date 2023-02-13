import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { config } from './config';

export async function startServer() {
  const fastify = Fastify({
    logger: config.nodeEnv !== 'test',
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(import('@fastify/cors'), { origin: true });

  await fastify.register(import('@fastify/sensible'));

  await fastify.register(import('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: {
      info: {
        title: `Shopping List API (${config.nodeEnv})`,
        version: config.version,
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
  await fastify.register(import('./products/products.routes'));
  await fastify.register(import('./lists/lists.routes'));
  await fastify.register(import('./list-items/list-items.routes'));
  await fastify.register(import('./list-accesses/list-accesses.routes'));

  await fastify.listen({ port: config.port });

  return fastify;
}
