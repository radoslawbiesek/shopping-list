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
    .addHook('onRequest', app.authenticate)
    .addHook('preHandler', validateOwnershipPreHandler)
    .get('/:listId/access', {
      schema: {
        params: listAccessParamsSchema,
        response: {
          200: getAllListAccessesReplySchema,
        },
      },
      handler: getAllListAccessesHandler,
    })
    .post('/:listId/access', {
      schema: {
        params: listAccessParamsSchema,
        body: createListAccessRequestBodySchema,
        response: {
          200: listAccessReplySchema,
        },
      },
      handler: createListAccessHandler,
    })
    .delete('/:listId/access/:id', {
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
