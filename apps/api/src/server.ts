import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { config } from './config';
import { logger } from './logger';

export async function startServer() {
  const app = Fastify({
    logger,
  });

  app
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler)
    .setErrorHandler((error, request, reply) => {
      if (error instanceof ZodError) {
        return reply.status(400).send(new Error(error.issues[0].message));
      }

      reply.send(error);
    });

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
    transform: jsonSchemaTransform,
  });
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
  });

  await app.register(import('./auth/jwt.plugin'));
  await app.register(import('./db/db'));

  await app.register(import('./auth/auth.routes'), { prefix: 'auth' });
  await app.register(import('./categories/categories.routes'), { prefix: 'categories' });
  await app.register(import('./products/products.routes'), { prefix: 'products' });
  await app.register(import('./lists/lists.routes'), { prefix: 'lists' });
  await app.register(import('./list-items/list-items.routes'), { prefix: 'lists' });
  await app.register(import('./list-accesses/list-access.routes'), { prefix: 'lists' });

  await app.listen({ port: config.port });

  return app;
}
