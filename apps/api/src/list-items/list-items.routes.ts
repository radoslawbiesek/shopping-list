import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { isPrismaError, PrismaErrorCode } from '../db/errors';

import { stringifyDates } from '../utils/format';
import {
  createListItemSchema,
  deleteListItemSchema,
  getAllListItemsSchema,
  updateListItemSchema,
} from './list-items.schema';

const listsRoutes: FastifyPluginAsync = async (fastify) => {
  async function validateAccess(userId: number, listId: number, readonly = false) {
    const listAccess = await fastify.db.listAccess.findFirst({ where: { userId, listId } });

    if (!listAccess || (!readonly && listAccess?.access === 'READ')) {
      throw fastify.httpErrors.notFound('list with given id does not exist');
    }
  }

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items',
    method: 'POST',
    schema: createListItemSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateAccess(request.user.id, request.params.listId);
    },
    async handler(request) {
      try {
        const { listId } = request.params;
        const { productId, isChecked, isPriority, amount } = request.body;

        const listItem = await fastify.db.listItem.create({
          data: {
            listId,
            productId,
            isChecked,
            isPriority,
            amount,
            createdBy: request.user.id,
          },
        });

        return stringifyDates(listItem);
      } catch (error: unknown) {
        if (isPrismaError(error)) {
          if (error.code === PrismaErrorCode.ForeignKeyViolation) {
            throw fastify.httpErrors.badRequest('productId: product with given id does not exist');
          }
        }

        throw error;
      }
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items',
    method: 'GET',
    schema: getAllListItemsSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateAccess(request.user.id, request.params.listId, true);
    },
    async handler(request) {
      const { listId } = request.params;
      const listItems = await fastify.db.listItem.findMany({
        where: {
          createdBy: request.user.id,
          listId,
        },
      });

      return listItems.map(stringifyDates);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items/:id',
    method: 'DELETE',
    schema: deleteListItemSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateAccess(request.user.id, request.params.listId);
    },
    async handler(request, reply) {
      const { id, listId } = request.params;
      const listItem = await fastify.db.listItem.findFirst({
        where: { id, listId },
      });
      if (!listItem) {
        throw fastify.httpErrors.notFound('list item not found');
      }

      await fastify.db.listItem.delete({ where: { id } });
      reply.status(204).send();
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items/:id',
    method: 'PATCH',
    schema: updateListItemSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateAccess(request.user.id, request.params.listId);
    },
    async handler(request) {
      const { id, listId } = request.params;
      const listItem = await fastify.db.listItem.findFirst({
        where: { id, listId },
      });
      if (!listItem) {
        throw fastify.httpErrors.notFound('list item not found');
      }

      const { amount, isChecked, isPriority } = request.body;

      const update = await fastify.db.listItem.update({
        where: { id },
        data: { amount, isChecked, isPriority },
      });

      return stringifyDates(update);
    },
  });
};

export default listsRoutes;
