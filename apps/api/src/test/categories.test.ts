import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { Category, User } from '@prisma/client';

import { startServer } from '../server';
import { clearMockedCategories, mockCategory, mockUser } from './utils/mock';
import { createAuthenticatedClient, createClient } from './utils/client';

let fastify: FastifyInstance;
let user: User;
let client;

beforeAll(async () => {
  fastify = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(fastify, user);
});

afterEach(async () => {
  await clearMockedCategories();
});

afterAll(async () => {
  await fastify.close();
});

describe.only('[Categories] - /categories', () => {
  describe('authentication', () => {
    it.each([['GET'], ['POST']])(
      '%s request requires authentication',
      async (method: 'GET' | 'POST') => {
        const client = createClient(fastify);
        const response = await client({
          method,
          url: '/categories',
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatchInlineSnapshot(
          `"No Authorization was found in request.headers"`,
        );
      },
    );
  });

  describe('Create [POST /categories]', () => {
    describe('validation', () => {
      const name = faker.random.alpha(8);
      it('name is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body must have required property 'name'"`,
        );
      });

      it('name must be unique', async () => {
        const category = await mockCategory({ createdBy: user.id });
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: category.name,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(`"name must be unique"`);
      });

      it('name must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: '',
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body/name must NOT have fewer than 1 characters"`,
        );
      });

      it('name must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: faker.random.alpha(26),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body/name must NOT have more than 25 characters"`,
        );
      });

      it('parentId must be valid category id', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name,
            parentId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"parentId: category with given id does not exist"`,
        );
      });
    });

    it('creates category', async () => {
      const name = faker.datatype.string();
      const response = await client({
        method: 'POST',
        url: '/categories',
        payload: {
          name,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(name);
      expect(response.body).toHaveProperty('id');
    });

    it('creates subcategory', async () => {
      const parentCategory = await mockCategory({ createdBy: user.id });
      const parentId = parentCategory.id;
      const name = faker.datatype.string();
      const response = await client({
        method: 'POST',
        url: '/categories',
        payload: {
          name,
          parentId,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(name);
      expect(response.body.parentId).toBe(parentId);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Get all [GET /categories]', () => {
    it('lists all categories', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(names.map((name) => mockCategory({ name, createdBy: user.id })));
      const response = await client({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((c: Category) => c.name)).toEqual(expect.arrayContaining(names));
    });

    it('lists only user categories', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(names.map((name) => mockCategory({ name, createdBy: user.id })));

      const otherUser = await mockUser();
      const otherNames = ['test4', 'test5'];
      await Promise.all(otherNames.map((name) => mockCategory({ name, createdBy: otherUser.id })));

      const response = await client({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((c: Category) => c.name)).toEqual(expect.arrayContaining(names));
    });
  });
});
