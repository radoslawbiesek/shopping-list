import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { loginSchema, meSchema, registerSchema } from './auth.schema';
import { createToken, createUser, getUserByEmail, validatePassword } from './auth.service';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/register',
    method: 'POST',
    schema: registerSchema,
    async handler(request) {
      return await createUser(fastify, request.body);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/login',
    method: 'POST',
    schema: loginSchema,
    async handler(request) {
      const user = await validatePassword(fastify, request.body);
      const token = await createToken(fastify, user);
      return { token };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: meSchema,
    async handler(request) {
      return await getUserByEmail(fastify, request.user.email);
    },
  });
};

export default authRoutes;
