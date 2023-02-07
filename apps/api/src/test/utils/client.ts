import { User } from '@prisma/client';
import { FastifyInstance, InjectOptions } from 'fastify';
import _ from 'lodash';

import { mockUser } from './mock';

export function createClient(fastify: FastifyInstance) {
  return async function (options: InjectOptions) {
    return fastify.inject(options).then((res) => ({
      ...res,
      body: JSON.parse(res.body),
    }));
  };
}

export async function createAuthenticatedClient(fastify: FastifyInstance, user?: User) {
  let mockedUser: User;
  if (!user) {
    mockedUser = await mockUser(fastify);
  } else {
    mockedUser = user;
  }
  const token = fastify.jwt.sign(mockedUser);
  const authHeaders = { headers: { authorization: `Bearer ${token}` } };

  return async function (options: InjectOptions) {
    return fastify.inject(_.merge({}, authHeaders, options)).then((res) => ({
      ...res,
      body: JSON.parse(res.body),
    }));
  };
}
