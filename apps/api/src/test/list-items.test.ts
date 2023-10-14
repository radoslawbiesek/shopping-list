import { FastifyInstance, HTTPMethods, InjectOptions } from 'fastify';
import { faker } from '@faker-js/faker';
import { List, ListItem, Product, User } from '@prisma/client';
import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { startServer } from '../server';
import {
  mockUser,
  mockProduct,
  mockList,
  mockListItem,
  clearMockedListItems,
  clearMockedUsers,
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
  await clearMockedUsers();
  await fastify.close();
});

const getUrl = (listItemId?: number, listId?: number) => {
  let url = `/lists/${listId ?? list.id}/items`;
  if (listItemId) {
    url += `/${listItemId}`;
  }
  return url;
};

describe('[List items] - /lists/:listId/items', () => {
  describe('authentication', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
      ['PATCH', faker.datatype.number()],
    ])(
      '%s request requires authentication',
      async (method: InjectOptions['method'], listItemId?: number) => {
        const client = createClient(fastify);
        const url = getUrl(listItemId);
        const response = await client({ method, url });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('No Authorization was found in request.headers');
      },
    );
  });

  describe('listId validation', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
      ['PATCH', faker.datatype.number()],
    ])(
      'validates if the list exists for the %s request',
      async (method: InjectOptions['method'], listItemId?: number) => {
        const invalidListId = 0;
        const url = getUrl(listItemId, invalidListId);
        const payload = {
          productId: product.id,
        };
        const response = await client({ method, url, payload });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('list with given id does not exist');
      },
    );
  });

  describe('authorization', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
      ['PATCH', faker.datatype.number()],
    ])(
      'validates whether the user has access to the list for the %s request',
      async (method: InjectOptions['method'], listItemId?: number) => {
        const otherUser = await mockUser();
        const client = await createAuthenticatedClient(fastify, otherUser);
        const url = getUrl(listItemId);
        const payload = {
          productId: product.id,
        };
        const response = await client({ method, url, payload });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('list with given id does not exist');
      },
    );
  });

  describe('Create [POST /lists/:listId/items]', () => {
    describe('validation', () => {
      it('productId must be valid product id', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {
            productId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('productId: product with given id does not exist');
      });

      it('amount must be a positive integer', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {
            productId: product.id,
            amount: -1,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/amount must be >= 0');
      });

      it('isPriority must be a boolean', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {
            productId: product.id,
            isPriority: faker.datatype.string(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/isPriority must be boolean');
      });

      it('isChecked must be a boolean', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {
            productId: product.id,
            isChecked: faker.datatype.string(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/isChecked must be boolean');
      });
    });

    it('creates list item', async () => {
      const isPriority = faker.datatype.boolean();
      const isChecked = faker.datatype.boolean();
      const amount = faker.datatype.number();

      const response = await client({
        method: 'POST',
        url: getUrl(),
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
        url: getUrl(),
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((li: ListItem) => li.productId)).toEqual(
        expect.arrayContaining(products.map((p) => p.id)),
      );
    });
  });

  describe('Delete [DELETE /lists/:listId/items/:id', () => {
    it('prevents deletion of a list item if it does not belong to the user', async () => {
      const otherUser = await mockUser();
      const listItem = await mockListItem({ createdBy: otherUser.id });

      const response = await client({
        method: 'DELETE',
        url: getUrl(listItem.id),
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('list item not found');
    });

    it('deletes list item', async () => {
      const listItem = await mockListItem({ createdBy: user.id, listId: list.id });

      const response = await client({
        method: 'DELETE',
        url: getUrl(listItem.id),
      });

      expect(response.statusCode).toBe(204);

      const foundListItem = await fastify.db.listItem.findUnique({ where: { id: listItem.id } });
      expect(foundListItem).toBe(null);
    });
  });

  describe('Update [PATCH /lists/:listId/items]', () => {
    describe('validation', () => {
      it('amount must be a positive integer', async () => {
        const response = await client({
          method: 'PATCH',
          url: getUrl(faker.datatype.number()),
          payload: {
            amount: -1,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/amount must be >= 0');
      });

      it('isPriority must be a boolean', async () => {
        const response = await client({
          method: 'PATCH',
          url: getUrl(faker.datatype.number()),
          payload: {
            isPriority: faker.datatype.string(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/isPriority must be boolean');
      });

      it('isChecked must be a boolean', async () => {
        const response = await client({
          method: 'PATCH',
          url: getUrl(faker.datatype.number()),
          payload: {
            isChecked: faker.datatype.string(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/isChecked must be boolean');
      });
    });

    it('updates list item', async () => {
      const listItem = await mockListItem({
        createdBy: user.id,
        listId: list.id,
        isPriority: false,
        isChecked: false,
        amount: 1,
      });

      const updates = {
        isPriority: true,
        isChecked: true,
        amount: 2,
      };

      const response = await client({
        method: 'PATCH',
        url: getUrl(listItem.id),
        payload: {
          ...updates,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.isPriority).toBe(updates.isPriority);
      expect(response.body.isChecked).toBe(updates.isChecked);
      expect(response.body.amount).toBe(updates.amount);
    });
  });
});
