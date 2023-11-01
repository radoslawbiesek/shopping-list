import { FastifyPluginAsync } from 'fastify';

import { deleteParamsSchema, deleteReplySchema } from '../common/common.schema';
import { createListHandler, deleteListHandler, getAllListsHandler } from './lists.handlers';
import {
  createListRequestBodySchema,
  listReplySchema,
  getAllListsReplySchema,
} from './lists.schema';

const listsRoutes: FastifyPluginAsync = async (app) => {
  app
    .addHook('onRequest', app.authenticate)
    .get('/', {
      schema: {
        response: {
          200: getAllListsReplySchema,
        },
      },
      handler: getAllListsHandler,
    })
    .post('/', {
      schema: {
        body: createListRequestBodySchema,
        response: {
          200: listReplySchema,
        },
      },
      handler: createListHandler,
    })
    .delete('/:id', {
      schema: {
        params: deleteParamsSchema,
        response: {
          204: deleteReplySchema,
        },
      },
      handler: deleteListHandler,
    });
};

export default listsRoutes;
