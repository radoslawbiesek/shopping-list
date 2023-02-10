import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { deleteSchema } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import { createProductSchema, getAllProductsSchema } from './products.schema';

const productsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'POST',
    onRequest: [fastify.authenticate],
    schema: createProductSchema,
    async handler(request) {
      try {
        const { name, description, image, categoryId } = request.body;
        const product = await fastify.db.product.create({
          data: {
            name,
            description,
            image,
            categoryId,
            createdBy: request.user.id,
          },
        });

        return stringifyDates(product);
      } catch (error) {
        if (isPrismaError(error)) {
          if (error.code === PrismaErrorCode.ForeignKeyViolation) {
            throw fastify.httpErrors.badRequest(
              'categoryId: category with given id does not exist',
            );
          }
        }
      }
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: getAllProductsSchema,
    async handler(request) {
      const products = await fastify.db.product.findMany({
        where: { createdBy: request.user.id },
      });

      return products.map(stringifyDates);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:id',
    method: 'DELETE',
    onRequest: [fastify.authenticate],
    schema: deleteSchema,
    async handler(request, reply) {
      try {
        const { id } = request.params;
        const product = await fastify.db.product.findFirst({
          where: { id, createdBy: request.user.id },
        });

        if (!product) {
          return fastify.httpErrors.notFound('product not found');
        }

        await fastify.db.product.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        if (isPrismaError(error)) {
          switch (error.code) {
            case PrismaErrorCode.ForeignKeyViolation:
              return fastify.httpErrors.badRequest('cannot delete product used as a list item');
          }
        }
      }
    },
  });
};

export default productsRoutes;
