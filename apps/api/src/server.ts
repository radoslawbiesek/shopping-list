import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { getEnvVariable } from './config/config';

export async function startServer() {
  const fastify = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(import('@fastify/sensible'));

  await fastify.register(import('./auth/jwt.plugin'));

  await fastify.register(import('./db/db'));

  await fastify.register(import('./auth/auth.routes'));

  fastify.get('/', { onRequest: [fastify.authenticate] }, () => 'Hello world');

  const address = await fastify.listen({ port: getEnvVariable('PORT') });
  console.log(`Server listening at ${address}`);

  return fastify;
}
