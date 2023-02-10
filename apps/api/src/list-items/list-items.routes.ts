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
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/items',
    method: 'POST',
    schema: createListItemSchema,
    onRequest: [fastify.authenticate],
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
            const fieldName = error.meta.field_name as string;
            if (fieldName.includes('productId')) {
              throw fastify.httpErrors.badRequest(
                'productId: product with given id does not exist',
              );
            } else if (fieldName.includes('listId')) {
              throw fastify.httpErrors.badRequest('listId: list with given id does not exist');
            }
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
    async handler(request, reply) {
      const { id } = request.params;
      const listItem = await fastify.db.listItem.findFirst({
        where: { id, createdBy: request.user.id },
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
    async handler(request) {
      const { id } = request.params;
      const listItem = await fastify.db.listItem.findFirst({
        where: { id, createdBy: request.user.id },
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
