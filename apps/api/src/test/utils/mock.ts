import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';

export async function mockUser(fastify: FastifyInstance, overrides = {}) {
  const data = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    name: faker.internet.userName(),
    ...overrides,
  };

  return await fastify.db.user.create({ data });
}

export async function mockCategory(fastify: FastifyInstance, userId: number, overrides = {}) {
  const data = {
    name: faker.random.alpha(8),
    createdBy: userId,
    ...overrides,
  };

  return await fastify.db.category.create({ data });
}
