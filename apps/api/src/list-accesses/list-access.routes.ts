import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteReplySchema } from '../common/common.schema';
import {
  createListAccessHandler,
  deleteListAccessHandler,
  getAllListAccessesHandler,
  validateOwnershipPreHandler,
} from './list-access.handlers';
import {
  createListAccessRequestBodySchema,
  deleteListAccessParamsSchema,
  getAllListAccessesReplySchema,
  listAccessParamsSchema,
  listAccessReplySchema,
} from './list-access.schema';

const listAccessesRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .addHook('onRequest', app.authenticate)
    .addHook('preHandler', validateOwnershipPreHandler)
    .get('/lists/:listId/access', {
      schema: {
        params: listAccessParamsSchema,
        response: {
          200: getAllListAccessesReplySchema,
        },
      },
      handler: getAllListAccessesHandler,
    })
    .post('/lists/:listId/access', {
      schema: {
        params: listAccessParamsSchema,
        body: createListAccessRequestBodySchema,
        response: {
          200: listAccessReplySchema,
        },
      },
      handler: createListAccessHandler,
    })
    .delete('/lists/:listId/access/:id', {
      schema: {
        params: deleteListAccessParamsSchema,
        response: {
          204: deleteReplySchema,
        },
      },
      handler: deleteListAccessHandler,
    });
};

export default listAccessesRoutes;
