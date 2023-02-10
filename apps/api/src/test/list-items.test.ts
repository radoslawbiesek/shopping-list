import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { List, ListItem, Product, User } from '@prisma/client';

import { startServer } from '../server';
import {
  mockUser,
  mockProduct,
  mockList,
  mockListItem,
  clearMockedListItems,
  clearMockedProducts,
  clearMockedCategories,
  clearMockedLists,
} from './utils/mock';
import { createAuthenticatedClient, createClient } from './utils/client';

let fastify: FastifyInstance;
let client;
let user: User;
let list: List;
let product: Product;

beforeAll(async () => {
  fastify = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(fastify, user);
  list = await mockList({ createdBy: user.id });
  product = await mockProduct({ createdBy: user.id });
});

afterEach(async () => {
  await clearMockedListItems();
});

afterAll(async () => {
  await fastify.close();
});

describe('[List items] - /lists/:listId/items', () => {
  describe('authentication', () => {
    it.each([['GET'], ['POST']])(
      '%s request requires authentication',
      async (method: 'GET' | 'POST') => {
        const client = createClient(fastify);
        const response = await client({
          method,
          url: `/lists/${list.id}/items`,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatchInlineSnapshot(
          `"No Authorization was found in request.headers"`,
        );
      },
    );
  });

  describe('Create [POST /lists/:listId/items]', () => {
    describe('validation', () => {
      it('listId param must be valid list id', async () => {
        const response = await client({
          method: 'POST',
          url: `/lists/${faker.datatype.number()}/items`,
          payload: {
            productId: product.id,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"listId: list with given id does not exist"`,
        );
      });

      it('productId must be valid product id', async () => {
        const response = await client({
          method: 'POST',
          url: `/lists/${list.id}/items`,
          payload: {
            productId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"productId: product with given id does not exist"`,
        );
      });
    });

    it('creates list item', async () => {
      const isPriority = faker.datatype.boolean();
      const isChecked = faker.datatype.boolean();
      const amount = faker.datatype.number();

      const response = await client({
        method: 'POST',
        url: `/lists/${list.id}/items`,
        payload: {
          productId: product.id,
          isPriority,
          isChecked,
          amount,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.productId).toBe(product.id);
      expect(response.body.listId).toBe(list.id);
      expect(response.body.isPriority).toBe(isPriority);
      expect(response.body.isChecked).toBe(isChecked);
      expect(response.body.amount).toBe(amount);
    });
  });

  describe('Get all [GET /lists/:listId/items]', () => {
    it('lists all list items', async () => {
      const productNames = ['test1', 'test2', 'test3'];
      const products = await Promise.all(
        productNames.map((name) => mockProduct({ createdBy: user.id, name })),
      );
      await Promise.all(
        products.map((product) =>
          mockListItem({
            createdBy: user.id,
            listId: list.id,
            productId: product.id,
          }),
        ),
      );
      const response = await client({
        method: 'GET',
        url: `/lists/${list.id}/items`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((li: ListItem) => li.productId)).toEqual(
        expect.arrayContaining(products.map((p) => p.id)),
      );
    });
  });
});
