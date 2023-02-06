import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { isPrismaError, PrismaErrorCode } from '../db/errors';

import { createCategorySchema, getAllCategoriesSchema } from './categories.schema';

const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories',
    method: 'POST',
    onRequest: [fastify.authenticate],
    schema: createCategorySchema,
    async handler(request) {
      try {
        const category = await fastify.db.category.create({
          data: {
            ...request.body,
            createdBy: request.user.id,
          },
        });

        return {
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        };
      } catch (error) {
        if (isPrismaError(error)) {
          if (error.code === PrismaErrorCode.UniqueKeyViolation) {
            throw fastify.httpErrors.badRequest('name must be unique');
          } else if (error.code === PrismaErrorCode.ForeignKeyViolation) {
            throw fastify.httpErrors.badRequest('parentId: category with given id does not exist');
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

      return categories.map((category) => ({
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      }));
    },
  });
};

export default categoriesRoutes;
