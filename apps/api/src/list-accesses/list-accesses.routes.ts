import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteReplySchema } from '../common/common.schema';
import {
  createListAccessHandler,
  deleteListAccessHandler,
  getAllListAccessesHandler,
  validateOwnershipPreHandler,
} from './list-accesses.handlers';
import {
  createListAccessRequestBodySchema,
  deleteListAccessParamsSchema,
  getAllListAccessesReplySchema,
  listAccessParamsSchema,
  listAccessReplySchema,
} from './list-accesses.schema';

const listAccessesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', app.authenticate);
  app.addHook('preHandler', validateOwnershipPreHandler);

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses',
    method: 'POST',
    schema: {
      params: listAccessParamsSchema,
      body: createListAccessRequestBodySchema,
      response: {
        200: listAccessReplySchema,
      },
    },
    handler: createListAccessHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses',
    method: 'GET',
    schema: {
      params: listAccessParamsSchema,
      response: {
        200: getAllListAccessesReplySchema,
      },
    },
    handler: getAllListAccessesHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses/:id',
    method: 'DELETE',
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
