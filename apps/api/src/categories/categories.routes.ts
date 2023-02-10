import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { deleteSchema } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';

import { createCategorySchema, getAllCategoriesSchema } from './categories.schema';

const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories',
    method: 'POST',
    onRequest: [fastify.authenticate],
    schema: createCategorySchema,
    async handler(request) {
      try {
        const { name, parentId } = request.body;
        const category = await fastify.db.category.create({
          data: {
            name,
            parentId,
            createdBy: request.user.id,
          },
        });

        return stringifyDates(category);
      } catch (error) {
        if (isPrismaError(error)) {
          switch (error.code) {
            case PrismaErrorCode.UniqueKeyViolation:
              throw fastify.httpErrors.badRequest('name must be unique');
            case PrismaErrorCode.ForeignKeyViolation:
              throw fastify.httpErrors.badRequest(
                'parentId: category with given id does not exist',
              );
          }
        }

        throw error;
      }
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: getAllCategoriesSchema,
    async handler(request) {
      const categories = await fastify.db.category.findMany({
        where: { createdBy: request.user.id },
      });

      return categories.map(stringifyDates);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories/:id',
    method: 'DELETE',
    onRequest: [fastify.authenticate],
    schema: deleteSchema,
    async handler(request, reply) {
      try {
        const { id } = request.params;
        const category = await fastify.db.category.findFirst({
          where: { id, createdBy: request.user.id },
        });

        if (!category) {
          return fastify.httpErrors.notFound('category not found');
        }

        await fastify.db.category.delete({ where: { id } });

        return reply.status(204).send();
      } catch (error) {
        if (isPrismaError(error)) {
          switch (error.code) {
            case PrismaErrorCode.ForeignKeyViolation:
              throw fastify.httpErrors.badRequest('cannot delete category containing products');
          }
        }

        throw error;
      }
    },
  });
};

export default categoriesRoutes;
