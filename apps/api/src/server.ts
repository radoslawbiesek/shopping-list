import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { config } from './config';

export async function startServer() {
  const app = Fastify({
    logger: config.nodeEnv !== 'test',
  }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(import('@fastify/cors'), { origin: true });
  await app.register(import('@fastify/sensible'));
  await app.register(import('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: {
      info: {
        title: `Shopping List API (${config.nodeEnv})`,
        version: config.version,
      },
    },
  });
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
  });

  await app.register(import('./auth/jwt.plugin'));
  await app.register(import('./db/db'));

  await app.register(import('./auth/auth.routes'));
  await app.register(import('./categories/categories.routes'));
  await app.register(import('./products/products.routes'));
  await app.register(import('./lists/lists.routes'));
  await app.register(import('./list-items/list-items.routes'));
  await app.register(import('./list-accesses/list-accesses.routes'));

  await app.listen({ port: config.port });

  return app;
}
