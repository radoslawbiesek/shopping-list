import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export async function createServer() {
  const fastify = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(import('@fastify/sensible'));

  await fastify.register(import('./db/db'));
  await fastify.register(import('./auth/auth.routes'));

  fastify.get('/', () => 'Hello world');

  return fastify;
}
