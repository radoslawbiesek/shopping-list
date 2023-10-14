import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import {
  loginReplySchema,
  loginRequestBodySchema,
  registerRequestBodySchema,
  userReplySchema,
} from './auth.schema';
import { loginHandler, meHandler, registerHandler } from './auth.handlers';

const authRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/register',
    method: 'POST',
    schema: {
      body: registerRequestBodySchema,
      response: {
        200: userReplySchema,
      },
    },
    handler: registerHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/login',
    method: 'POST',
    schema: {
      body: loginRequestBodySchema,
      response: {
        200: loginReplySchema,
      },
    },
    handler: loginHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'GET',
    onRequest: [app.authenticate],
    schema: {
      response: {
        200: userReplySchema,
      },
    },
    handler: meHandler,
  });
};

export default authRoutes;
