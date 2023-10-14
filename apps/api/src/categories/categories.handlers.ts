import { RouteHandler } from 'fastify';

import { DeleteParams, DeleteReply } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import { CreateCategoryRequestBody, CategoryReply, AllCategoriesReply } from './categories.schema';

export const createCategoryHandler: RouteHandler<{
  Body: CreateCategoryRequestBody;
  Reply: CategoryReply;
}> = async function createCategoryHandler(request) {
  try {
    const { name, parentId } = request.body;
    const category = await this.db.category.create({
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
          throw this.httpErrors.badRequest('name must be unique');
        case PrismaErrorCode.ForeignKeyViolation:
          throw this.httpErrors.badRequest('parentId: category with given id does not exist');
      }
    }

    throw error;
  }
};

export const getAllCategoriesHandler: RouteHandler<{ Reply: AllCategoriesReply }> =
  async function getAllCategoriesHandler(request) {
    const categories = await this.db.category.findMany({
      where: { createdBy: request.user.id },
    });

    return categories.map(stringifyDates);
  };

export const deleteCategoryHandler: RouteHandler<{ Params: DeleteParams; Reply: DeleteReply }> =
  async function deleteCategoryHandler(request, reply) {
    try {
      const { id } = request.params;
      const category = await this.db.category.findFirst({
        where: { id, createdBy: request.user.id },
      });

      if (!category) {
        throw this.httpErrors.notFound('category not found');
      }

      await this.db.category.delete({ where: { id } });

      return reply.status(204).send(null);
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case PrismaErrorCode.ForeignKeyViolation:
            throw this.httpErrors.badRequest('cannot delete category containing products');
        }
      }

      throw error;
    }
  };
