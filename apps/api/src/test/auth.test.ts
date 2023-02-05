import { FastifyInstance } from 'fastify';

import { startServer } from '../server';

let fastify: FastifyInstance;

beforeAll(async () => {
  fastify = await startServer();
});

afterAll(async () => {
  await fastify.close();
});

test('test', () => {
  expect(true).toBe(true);
});
