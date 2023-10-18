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
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .addHook('onRequest', app.authenticate)
    .addHook('preHandler', validateListItemAccessPreHandler)
    .get('/:listId/items', {
      schema: {
        params: listItemParamsSchema,
        response: {
          200: getAllListItemsReplySchema,
        },
      },
      handler: getAllListItemsHandler,
    })
    .post('/:listId/items', {
      schema: {
        params: listItemParamsSchema,
        body: createListItemRequestBodySchema,
        response: {
          200: listItemReplySchema,
        },
      },
      handler: createListItemHandler,
    })
    .patch('/:listId/items/:id', {
      schema: {
        params: updateListItemParamsSchema,
        body: updateListItemRequestBodySchema,
        response: {
          200: listItemReplySchema,
        },
      },
      handler: updateListItemHandler,
    })
    .delete('/:listId/items/:id', {
      schema: {
        params: deleteListItemParamsSchema,
        response: {
          204: deleteReplySchema,
        },
      },
      handler: deleteListItemHandler,
    });
};

export default listItemsRoutes;
