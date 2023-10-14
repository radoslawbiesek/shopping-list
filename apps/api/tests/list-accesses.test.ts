import { FastifyInstance, InjectOptions } from 'fastify';
import { faker } from '@faker-js/faker';
import { Access, List, ListAccess, User } from '@prisma/client';
import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { startServer } from '../src/server';
import {
  mockUser,
  mockList,
  clearMockedUsers,
  mockListAccess,
  clearMockedListAccesses,
} from './utils/mock';
import { createAuthenticatedClient, createClient } from './utils/client';

let fastify: FastifyInstance;
let client;
let user: User;
let list: List;

beforeAll(async () => {
  fastify = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(fastify, user);
  list = await mockList({ createdBy: user.id });
});

afterEach(async () => {
  await clearMockedListAccesses();
});

afterAll(async () => {
  await clearMockedUsers();
  await fastify.close();
});

const getUrl = (listAccessId?: number, listId?: number) => {
  let url = `/lists/${listId ?? list.id}/accesses`;
  if (listAccessId) {
    url += `/${listAccessId}`;
  }
  return url;
};

describe('[List accesses] - /lists/:listId/accesses', () => {
  describe('authentication', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
    ])(
      '%s request requires authentication',
      async (method: InjectOptions['method'], listAccessId?: number) => {
        const client = createClient(fastify);
        const url = getUrl(listAccessId);
        const response = await client({ method, url });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('No Authorization was found in request.headers');
      },
    );
  });

  describe('listId validation', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
    ])(
      'validates if the list exists for the %s request',
      async (method: InjectOptions['method'], listAccessId?: number) => {
        const invalidListId = 0;
        const options: InjectOptions = {
          method,
          url: getUrl(listAccessId, invalidListId),
        };
        if (method === 'POST') {
          options.payload = {
            userId: faker.datatype.number(),
          };
        }

        const response = await client(options);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('list with given id does not exist');
      },
    );
  });

  describe('authorization', () => {
    it.each([
      ['GET', null],
      ['POST', null],
      ['DELETE', faker.datatype.number()],
    ])(
      'validates whether the user has access to the list for the %s request',
      async (method: InjectOptions['method'], listAccessId?: number) => {
        const otherUser = await mockUser();
        const client = await createAuthenticatedClient(fastify, otherUser);
        const options: InjectOptions = {
          method,
          url: getUrl(listAccessId),
        };
        if (method === 'POST') {
          options.payload = {
            userId: faker.datatype.number(),
          };
        }

        const response = await client(options);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          'you do not have persmissions to perform this action',
        );
      },
    );
  });

  describe('Create [POST /lists/:listId/accesses]', () => {
    describe('validation', () => {
      it('userId is required', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'userId'");
      });

      it('userId must be valid', async () => {
        const response = await client({
          method: 'POST',
          url: getUrl(),
          payload: {
            userId: faker.datatype.number(),
          },
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('user with given id does not exist');
      });
    });

    it('creates list access', async () => {
      const otherUser = await mockUser();
      const userId = otherUser.id;

      const response = await client({
        method: 'POST',
        url: getUrl(),
        payload: {
          userId,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.access).toBe(Access.READ_WRITE);
      expect(response.body.userId).toBe(userId);

      const listAccess = await fastify.db.listAccess.findUnique({
        where: { id: response.body.id },
      });
      expect(listAccess.access).toBe(Access.READ_WRITE);
      expect(listAccess.userId).toBe(userId);
    });
  });

  describe('Get all [GET /lists/:listId/access]', () => {
    it('lists all list accesses', async () => {
      const users = await Promise.all([await mockUser(), await mockUser()]);
      const listAccesses = await Promise.all(
        users.map(
          async (otherUser) =>
            await mockListAccess({ userId: otherUser.id, createdBy: user.id, listId: list.id }),
        ),
      );

      const response = await client({
        method: 'GET',
        url: getUrl(),
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(listAccesses.length);
      expect(response.body.map((la: ListAccess) => la.userId)).toEqual(
        expect.arrayContaining(users.map((user) => user.id)),
      );
    });
  });

  describe('Delete [DELETE /lists/:listId/access/:id', () => {
    it('deletes list access', async () => {
      const listAccess = await mockListAccess({ createdBy: user.id, listId: list.id });

      const response = await client({
        method: 'DELETE',
        url: getUrl(listAccess.id),
      });

      expect(response.statusCode).toBe(204);

      const foundListAccess = await fastify.db.listAccess.findUnique({
        where: { id: listAccess.id },
      });
      expect(foundListAccess).toBe(null);
    });
  });
});
