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
  app.addHook('onRequest', app.authenticate);

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists',
    method: 'POST',
    schema: {
      body: createListRequestBodySchema,
      response: {
        200: listReplySchema,
      },
    },
    handler: createListHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists',
    method: 'GET',
    schema: {
      response: {
        200: getAllListsReplySchema,
      },
    },
    handler: getAllListsHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:id',
    method: 'DELETE',
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
