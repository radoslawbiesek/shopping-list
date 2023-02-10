import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { Category, prisma, Product, User } from '@prisma/client';

import { startServer } from '../server';
import {
  mockCategory,
  mockUser,
  mockProduct,
  mockListItem,
  clearMockedProducts,
  clearMockedUsers,
  clearMockedListItems,
} from './utils/mock';
import { createAuthenticatedClient, createClient } from './utils/client';

let fastify: FastifyInstance;
let client;
let user: User;
let category: Category;

beforeAll(async () => {
  fastify = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(fastify, user);
  category = await mockCategory({ createdBy: user.id });
});

afterEach(async () => {
  await clearMockedListItems();
  await clearMockedProducts();
});

afterAll(async () => {
  await clearMockedUsers();
  await fastify.close();
});

describe.only('[Products] - /products', () => {
  describe('authentication', () => {
    it.each([['GET'], ['POST']])(
      '%s request requires authentication',
      async (method: 'GET' | 'POST') => {
        const client = createClient(fastify);
        const response = await client({
          method,
          url: '/products',
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatchInlineSnapshot(
          `"No Authorization was found in request.headers"`,
        );
      },
    );

    it.each([['DELETE']])('%s request requires authentication', async (method: 'DELETE') => {
      const client = createClient(fastify);
      const response = await client({
        method,
        url: `/products/${faker.datatype.number()}`,
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatchInlineSnapshot(
        `"No Authorization was found in request.headers"`,
      );
    });
  });

  describe('Create [POST /products]', () => {
    describe('validation', () => {
      it('name is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/products',
          payload: {
            categoryId: category.id,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body must have required property 'name'"`,
        );
      });

      it('name must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/products',
          payload: {
            name: '',
            categoryId: category.id,
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
          url: '/products',
          payload: {
            name: faker.random.alpha(26),
            categoryId: category.id,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body/name must NOT have more than 25 characters"`,
        );
      });

      it('categoryId must be valid category id', async () => {
        const response = await client({
          method: 'POST',
          url: '/products',
          payload: {
            name: faker.random.alpha(8),
            categoryId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"categoryId: category with given id does not exist"`,
        );
      });

      it('description must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/products',
          payload: {
            name: faker.random.alpha(8),
            categoryId: category.id,
            description: faker.random.alpha(121),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body/description must NOT have more than 120 characters"`,
        );
      });

      it('image must be valid url', async () => {
        const response = await client({
          method: 'POST',
          url: '/products',
          payload: {
            name: faker.random.alpha(8),
            categoryId: category.id,
            image: 'invalid url',
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(`"body/image must match format "uri""`);
      });
    });

    it('creates product', async () => {
      const name = faker.random.alpha(8);
      const description = faker.random.alpha(50);
      const image = faker.internet.url();

      const response = await client({
        method: 'POST',
        url: '/products',
        payload: {
          name,
          description,
          image,
          categoryId: category.id,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(name);
      expect(response.body.description).toBe(description);
      expect(response.body.image).toBe(image);
      expect(response.body.categoryId).toBe(category.id);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Get all [GET /products]', () => {
    it('lists all products', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(
        names.map((name) =>
          mockProduct({
            name,
            categoryId: category.id,
            createdBy: user.id,
          }),
        ),
      );
      const response = await client({
        method: 'GET',
        url: '/products',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((p: Product) => p.name)).toEqual(expect.arrayContaining(names));
    });

    it('lists only user products', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(
        names.map((name) =>
          mockProduct({
            name,
            categoryId: category.id,
            createdBy: user.id,
          }),
        ),
      );

      const otherUser = await mockUser();
      const otherNames = ['test4', 'test5'];
      await Promise.all(
        otherNames.map((name) =>
          mockProduct({
            name,
            categoryId: category.id,
            createdBy: otherUser.id,
          }),
        ),
      );

      const response = await client({
        method: 'GET',
        url: '/products',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((p: Product) => p.name)).toEqual(expect.arrayContaining(names));
    });
  });

  describe('Delete [DELETE /products/:id', () => {
    it('prevents product deletion if used as a list item', async () => {
      const product = await mockProduct({ createdBy: user.id });
      await mockListItem({ createdBy: user.id, productId: product.id });

      const response = await client({
        method: 'DELETE',
        url: `products/${product.id}`,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatchInlineSnapshot(
        `"cannot delete product used as a list item"`,
      );
    });

    it('prevents deletion of a product if it does not belong to the user', async () => {
      const otherUser = await mockUser();
      const product = await mockProduct({ createdBy: otherUser.id });

      const response = await client({
        method: 'DELETE',
        url: `products/${product.id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatchInlineSnapshot(`"product not found"`);
    });

    it('deletes product', async () => {
      const product = await mockProduct({ createdBy: user.id });

      const response = await client({
        method: 'DELETE',
        url: `products/${product.id}`,
      });

      expect(response.statusCode).toBe(204);

      const found = await fastify.db.product.findUnique({ where: { id: product.id } });
      expect(found).toBe(null);
    });
  });
});
