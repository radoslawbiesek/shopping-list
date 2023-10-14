import { User } from '@prisma/client';
import { FastifyInstance, InjectOptions } from 'fastify';

import { mockUser } from './mock';

export function createClient(app: FastifyInstance) {
  return async function (options: InjectOptions) {
    return app.inject(options).then((res) => ({
      ...res,
      body: JSON.parse(res.body),
    }));
  };
}

export async function createAuthenticatedClient(app: FastifyInstance, user?: User) {
  let mockedUser: User;
  if (!user) {
    mockedUser = await mockUser();
  } else {
    mockedUser = user;
  }
  const token = app.jwt.sign(mockedUser);

  return async function (options: InjectOptions) {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers.authorization = `Bearer ${token}`;

    return app.inject(options).then((res) => ({
      ...res,
      body: res.body ? JSON.parse(res.body) : null,
    }));
  };
}
