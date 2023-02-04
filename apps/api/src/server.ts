import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', () => 'Hello world');

export { fastify };
