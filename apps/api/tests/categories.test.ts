import { FastifyInstance, InjectOptions } from 'fastify';
import { faker } from '@faker-js/faker';
import { Category, User } from '@prisma/client';
import { describe, test, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { startServer } from '../src/server';
import {
  clearMockedCategories,
  clearMockedProducts,
  clearMockedUsers,
  mockCategory,
  mockProduct,
  mockUser,
} from './utils/mock';
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
  await clearMockedProducts();
  await clearMockedCategories();
});

afterAll(async () => {
  await clearMockedUsers();
  await fastify.close();
});

describe('[Categories] - /categories', () => {
  describe('authentication', () => {
    test.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
    ])(
      '%s request requires authentication',
      async (method: InjectOptions['method'], categoryId?: number) => {
        const client = createClient(fastify);
        const url = `/categories${categoryId ? `/${categoryId}` : ''}`;
        const response = await client({ method, url });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('No Authorization was found in request.headers');
      },
    );
  });

  describe('Create [POST /categories]', () => {
    describe('validation', () => {
      const name = faker.random.alpha(8);
      test('name is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'name'");
      });

      test('name must be unique', async () => {
        const category = await mockCategory({ createdBy: user.id });
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: category.name,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('name must be unique');
      });

      test('name must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: '',
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/name must NOT have fewer than 1 characters');
      });

      test('name must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name: faker.random.alpha(26),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/name must NOT have more than 25 characters');
      });

      test('parentId must be valid category id', async () => {
        const response = await client({
          method: 'POST',
          url: '/categories',
          payload: {
            name,
            parentId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('parentId: category with given id does not exist');
      });
    });

    test('creates category', async () => {
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

    test('creates subcategory', async () => {
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
    test('lists all categories', async () => {
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

    test('lists only user categories', async () => {
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

  describe('Delete [DELETE /categories/:id', () => {
    test('prevents category deletion if it contains products', async () => {
      const category = await mockCategory({ createdBy: user.id });
      await mockProduct({ createdBy: user.id, categoryId: category.id });

      const response = await client({
        method: 'DELETE',
        url: `categories/${category.id}`,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('cannot delete category containing products');
    });

    test('prevents deletion of a category if it does not belong to the user', async () => {
      const otherUser = await mockUser();
      const category = await mockCategory({ createdBy: otherUser.id });

      const response = await client({
        method: 'DELETE',
        url: `categories/${category.id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('category not found');
    });

    test('deletes category', async () => {
      const category = await mockCategory({ createdBy: user.id });

      const response = await client({
        method: 'DELETE',
        url: `categories/${category.id}`,
      });

      expect(response.statusCode).toBe(204);

      const found = await fastify.db.category.findUnique({ where: { id: category.id } });
      expect(found).toBe(null);
    });
  });
});
