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
    createdBy: userId,
    name: faker.random.alpha(8),
    ...overrides,
  };

  return await fastify.db.category.create({ data });
}

export async function mockProduct(
  fastify: FastifyInstance,
  userId: number,
  categoryId?: number,
  overrides = {},
) {
  let catId = categoryId;
  if (!catId) {
    const category = await mockCategory(fastify, userId);
    catId = category.id;
  }
  const data = {
    createdBy: userId,
    categoryId: catId,
    name: faker.random.alpha(8),
    description: faker.lorem.lines(2),
    image: faker.internet.url(),
    ...overrides,
  };

  return await fastify.db.product.create({ data });
}
