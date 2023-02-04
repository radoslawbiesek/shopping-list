import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { registerSchema } from './auth.schema';
import { createUser } from './auth.service';

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
};

export default authRoutes;
