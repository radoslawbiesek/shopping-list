import { RouteHandler } from 'fastify';

import { DeleteParams, DeleteReply } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import { CreateProductRequestBody, ProductReply, GetAllProductsReply } from './products.schema';

export const createProductHandler: RouteHandler<{
  Body: CreateProductRequestBody;
  Reply: ProductReply;
}> = async function createProductHandler(request) {
  try {
    const { name, description, image, categoryId } = request.body;
    const product = await this.db.product.create({
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
        throw this.httpErrors.badRequest('categoryId: category with given id does not exist');
      }
    }
  }
};

export const getAllProductsHandler: RouteHandler<{ Reply: GetAllProductsReply }> =
  async function getAllProductsHandler(request) {
    const products = await this.db.product.findMany({
      where: { createdBy: request.user.id },
    });

    return products.map(stringifyDates);
  };

export const deleteProductHandler: RouteHandler<{ Params: DeleteParams; Reply: DeleteReply }> =
  async function deleteProductHandler(request, reply) {
    try {
      const { id } = request.params;
      const product = await this.db.product.findFirst({
        where: { id, createdBy: request.user.id },
      });

      if (!product) {
        throw this.httpErrors.notFound('product not found');
      }

      await this.db.product.delete({ where: { id } });

      return reply.status(204).send();
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case PrismaErrorCode.ForeignKeyViolation:
            throw this.httpErrors.badRequest('cannot delete product used as a list item');
        }
      }

      throw error;
    }
  };
