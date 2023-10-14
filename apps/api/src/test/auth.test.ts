import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { describe, test, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { startServer } from '../server';
import { createClient } from './utils/client';
import { clearMockedUsers } from './utils/mock';

let fastify: FastifyInstance;
let client;

beforeAll(async () => {
  fastify = await startServer();
  client = createClient(fastify);
});

afterEach(async () => {
  await clearMockedUsers();
});

afterAll(async () => {
  await clearMockedUsers();
  await fastify.close();
});

describe('[Auth] - /auth', () => {
  describe('Auth Flow', () => {
    test('register, login and receiving user information', async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.internet.userName(),
      };

      // Register
      const registerResponse = await client({
        method: 'POST',
        url: '/auth/register',
        payload: data,
      });
      expect(registerResponse.statusCode).toBe(200);
      expect(registerResponse.body).toHaveProperty('id');
      expect(registerResponse.body).not.toHaveProperty('password');
      expect(registerResponse.body.name).toBe(data.name);
      expect(registerResponse.body.email).toBe(data.email);

      // Login with invalid password
      const loginError = await client({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: data.email,
          password: 'invalid password',
        },
      });
      expect(loginError.statusCode).toBe(400);
      expect(loginError.body.message).toBe('no active account found with the given credentials');

      // Login
      const loginResponse = await client({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: data.email,
          password: data.password,
        },
      });
      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');

      // Me
      const meResponse = await client({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: `Bearer ${loginResponse.body.token}`,
        },
      });
      expect(meResponse.statusCode).toBe(200);
      expect(meResponse.body).toHaveProperty('id');
      expect(meResponse.body).not.toHaveProperty('password');
      expect(meResponse.body.name).toBe(data.name);
      expect(meResponse.body.email).toBe(data.email);
    });
  });

  describe('Register [POST /auth/register]', () => {
    describe('validation', () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const name = faker.internet.userName();

      const longEmail = 'a'.repeat(42) + '@test.com';
      const shortPassword = faker.internet.password(7);
      const longPassword = faker.internet.password(17);
      const shortName = 'a'.repeat(3);
      const longName = 'a'.repeat(26);

      test('password is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            name,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'password'");
      });

      test('password must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            name,
            password: shortPassword,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/password must NOT have fewer than 8 characters');
      });

      test('password must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            name,
            password: longPassword,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/password must NOT have more than 16 characters');
      });

      test('email must be valid', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email: 'invalid email',
            name,
            password,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/email must match format "email"');
      });

      test('email must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email: longEmail,
            name,
            password,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/email must NOT have more than 50 characters');
      });

      test('name is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            password,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'name'");
      });

      test('name must not be too short', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            password,
            name: shortName,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/name must NOT have fewer than 4 characters');
      });

      test('name must not be too long', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            password,
            name: longName,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('body/name must NOT have more than 25 characters');
      });

      test('email must be unique', async () => {
        await fastify.db.user.create({
          data: {
            email,
            name: faker.internet.userName(),
            password,
          },
        });
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email,
            password,
            name,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('email is already taken');
      });

      test('name must be unique', async () => {
        await fastify.db.user.create({
          data: {
            email,
            name,
            password,
          },
        });
        const response = await client({
          method: 'POST',
          url: '/auth/register',
          payload: {
            email: faker.internet.email(),
            password,
            name,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('name is already taken');
      });
    });
  });

  describe('Login [POST /auth/login]', () => {
    describe('validation', () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      test('password is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/login',
          payload: {
            email,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'password'");
      });

      test('email is required', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/login',
          payload: {
            password,
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("body must have required property 'email'");
      });

      test('user must exist', async () => {
        const response = await client({
          method: 'POST',
          url: '/auth/login',
          payload: {
            password,
            email: 'not_existing_email@test.com',
          },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('no active account found with the given credentials');
      });
    });
  });

  describe('Me [GET /auth/me]', () => {
    test('token is required', async () => {
      const response = await client({
        method: 'GET',
        url: '/auth/me',
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('No Authorization was found in request.headers');
    });
  });
});
