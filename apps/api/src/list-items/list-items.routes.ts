import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteReplySchema } from '../common/common.schema';
import {
  createListItemHandler,
  deleteListItemHandler,
  getAllListItemsHandler,
  updateListItemHandler,
  validateListItemAccessPreHandler,
} from './list-items.handlers';
import {
  createListItemRequestBodySchema,
  deleteListItemParamsSchema,
  getAllListItemsReplySchema,
  listItemParamsSchema,
  listItemReplySchema,
  updateListItemParamsSchema,
  updateListItemRequestBodySchema,
} from './list-items.schema';

const listItemsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', app.authenticate);
  app.addHook('preHandler', validateListItemAccessPreHandler);

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items',
    method: 'POST',
    schema: {
      params: listItemParamsSchema,
      body: createListItemRequestBodySchema,
      response: {
        200: listItemReplySchema,
      },
    },
    handler: createListItemHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items',
    method: 'GET',
    schema: {
      params: listItemParamsSchema,
      response: {
        200: getAllListItemsReplySchema,
      },
    },
    handler: getAllListItemsHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items/:id',
    method: 'DELETE',
    schema: {
      params: deleteListItemParamsSchema,
      response: {
        204: deleteReplySchema,
      },
    },
    handler: deleteListItemHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items/:id',
    method: 'PATCH',
    schema: {
      params: updateListItemParamsSchema,
      body: updateListItemRequestBodySchema,
      response: {
        200: listItemReplySchema,
      },
    },
    handler: updateListItemHandler,
  });
};

export default listItemsRoutes;
