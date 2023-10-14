import { RouteHandler, FastifyRequest } from 'fastify';

import { DeleteReply } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import {
  CreateListItemRequestBody,
  DeleteListItemParams,
  GetAllListItemsReply,
  ListItemParams,
  ListItemReply,
  UpdateListItemParams,
  UpdateListItemRequestBody,
} from './list-items.schema';

export async function validateListItemAccessPreHandler(
  request: FastifyRequest<{ Params: ListItemParams }>,
) {
  const listAccess = await this.db.listAccess.findFirst({
    where: { userId: request.user.id, listId: request.params.listId },
  });

  if (!listAccess) {
    throw this.httpErrors.notFound('list with given id does not exist');
  }
}

export const createListItemHandler: RouteHandler<{
  Params: ListItemParams;
  Body: CreateListItemRequestBody;
}> = async function createListItemHandler(request) {
  try {
    const { listId } = request.params;
    const { productId, isChecked, isPriority, amount } = request.body;

    const listItem = await this.db.listItem.create({
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
        throw this.httpErrors.badRequest('productId: product with given id does not exist');
      }
    }

    throw error;
  }
};

export const getAllListItemsHandler: RouteHandler<{
  Params: ListItemParams;
  Reply: GetAllListItemsReply;
}> = async function getAllListItemsHandler(request) {
  const { listId } = request.params;
  const listItems = await this.db.listItem.findMany({
    where: {
      createdBy: request.user.id,
      listId,
    },
  });

  return listItems.map(stringifyDates);
};

export const deleteListItemHandler: RouteHandler<{
  Params: DeleteListItemParams;
  Reply: DeleteReply;
}> = async function deleteListItemHandler(request, reply) {
  const { id, listId } = request.params;
  const listItem = await this.db.listItem.findFirst({
    where: { id, listId },
  });
  if (!listItem) {
    throw this.httpErrors.notFound('list item not found');
  }

  await this.db.listItem.delete({ where: { id } });
  reply.status(204).send();
};

export const updateListItemHandler: RouteHandler<{
  Params: UpdateListItemParams;
  Body: UpdateListItemRequestBody;
  Reply: ListItemReply;
}> = async function updateListItemHandler(request) {
  const { id, listId } = request.params;
  const listItem = await this.db.listItem.findFirst({
    where: { id, listId },
  });
  if (!listItem) {
    throw this.httpErrors.notFound('list item not found');
  }

  const { amount, isChecked, isPriority } = request.body;

  const update = await this.db.listItem.update({
    where: { id },
    data: { amount, isChecked, isPriority },
  });

  return stringifyDates(update);
};
