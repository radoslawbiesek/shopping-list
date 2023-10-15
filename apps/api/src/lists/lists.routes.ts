import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
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
    .withTypeProvider<TypeBoxTypeProvider>()
    .addHook('onRequest', app.authenticate)
    .get('/lists', {
      schema: {
        response: {
          200: getAllListsReplySchema,
        },
      },
      handler: getAllListsHandler,
    })
    .post('/lists', {
      schema: {
        body: createListRequestBodySchema,
        response: {
          200: listReplySchema,
        },
      },
      handler: createListHandler,
    })
    .delete('/lists/:id', {
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
