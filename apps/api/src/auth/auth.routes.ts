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
      const user = await createUser(fastify, request.body);
      return {
        data: user,
      };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/login',
    method: 'POST',
    schema: loginSchema,
    async handler(request) {
      const user = await validatePassword(fastify, request.body);
      const data = await createToken(fastify, user);
      return {
        data,
      };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: meSchema,
    async handler(request) {
      const user = await getUserByEmail(fastify, request.user.email);
      return { data: user };
    },
  });
};

export default authRoutes;
