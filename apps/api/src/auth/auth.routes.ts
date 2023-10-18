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
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .post('/register', {
      schema: {
        body: registerRequestBodySchema,
        response: {
          200: userReplySchema,
        },
      },
      handler: registerHandler,
    })
    .post('/login', {
      schema: {
        body: loginRequestBodySchema,
        response: {
          200: loginReplySchema,
        },
      },
      handler: loginHandler,
    })
    .get('/me', {
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
