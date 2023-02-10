import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { isPrismaError, PrismaErrorCode } from '../db/errors';

import { stringifyDates } from '../utils/format';
import { createListItemSchema, getAllListItemsSchema } from './list-items.schema';

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
};

export default listsRoutes;
