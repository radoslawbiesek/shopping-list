import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { List, User } from '@prisma/client';

import { startServer } from '../server';
import { mockUser, mockList, clearMockedLists, clearMockedUsers, mockListItem } from './utils/mock';
import { createAuthenticatedClient, createClient } from './utils/client';

let fastify: FastifyInstance;
let client;
let user: User;

beforeAll(async () => {
  fastify = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(fastify, user);
});

afterEach(async () => {
  await clearMockedLists();
});

afterAll(async () => {
  await clearMockedUsers();
  await fastify.close();
});

describe.only('[Lists] - /lists', () => {
  describe('authentication', () => {
    it.each([['GET'], ['POST']])(
      '%s request requires authentication',
      async (method: 'GET' | 'POST') => {
        const client = createClient(fastify);
        const response = await client({
          method,
          url: '/lists',
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
        url: `/lists/${faker.datatype.number()}`,
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatchInlineSnapshot(
        `"No Authorization was found in request.headers"`,
      );
    });
  });

  describe('Create [POST /lists]', () => {
    describe('validation', () => {
      it('name is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/lists',
          payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body must have required property 'name'"`,
        );
      });

      it('name must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/lists',
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
          url: '/lists',
          payload: {
            name: faker.random.alpha(26),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatchInlineSnapshot(
          `"body/name must NOT have more than 25 characters"`,
        );
      });
    });

    it('creates list', async () => {
      const name = faker.random.alpha(8);

      const response = await client({
        method: 'POST',
        url: '/lists',
        payload: {
          name,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(name);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Get all [GET /lists]', () => {
    it('lists all lists', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(names.map((name) => mockList({ name, createdBy: user.id })));
      const response = await client({
        method: 'GET',
        url: '/lists',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((l: List) => l.name)).toEqual(expect.arrayContaining(names));
    });

    it('lists only user products', async () => {
      const names = ['test1', 'test2', 'test3'];
      await Promise.all(names.map((name) => mockList({ name, createdBy: user.id })));

      const otherUser = await mockUser();
      const otherNames = ['test4', 'test5'];
      await Promise.all(otherNames.map((name) => mockList({ name, createdBy: otherUser.id })));

      const response = await client({
        method: 'GET',
        url: '/lists',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.map((l: List) => l.name)).toEqual(expect.arrayContaining(names));
    });
  });

  describe('Delete [DELETE /lists/:id', () => {
    it('prevents deletion of a list if it does not belong to the user', async () => {
      const otherUser = await mockUser();
      const list = await mockList({ createdBy: otherUser.id });

      const response = await client({
        method: 'DELETE',
        url: `lists/${list.id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toMatchInlineSnapshot(`"list not found"`);
    });

    it('deletes list and attached list items', async () => {
      const list = await mockList({ createdBy: user.id });
      const listItem = await mockListItem({ createdBy: user.id, listId: list.id });

      const response = await client({
        method: 'DELETE',
        url: `lists/${list.id}`,
      });

      expect(response.statusCode).toBe(204);

      const foundList = await fastify.db.list.findUnique({ where: { id: list.id } });
      expect(foundList).toBe(null);

      const foundListItem = await fastify.db.listItem.findUnique({ where: { id: listItem.id } });
      expect(foundListItem).toBe(null);
    });
  });
});
