import { and, eq } from 'drizzle-orm';
import { FastifyRequest, RouteHandler } from 'fastify';

import { DeleteReply } from '../common/common.types';
import { listAccessTable, listTable } from '../database/schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import {
  CreateListAccessRequestBody,
  DeleteListAccessParams,
  GetAllListAccessesReply,
  ListAccessParams,
  ListAccessReply,
} from './list-access.types';

export async function validateOwnershipPreHandler(
  request: FastifyRequest<{ Params: ListAccessParams }>,
) {
  const list = (
    await this.database.select(listTable).where(eq(listTable.id, request.params.listId))
  )[0];

  if (!list) {
    throw this.httpErrors.notFound('list with given id does not exist');
  }

  if (list.createdBy !== request.user.id) {
    throw this.httpErrors.forbidden('you do not have persmissions to perform this action');
  }
}

export const createListAccessHandler: RouteHandler<{
  Params: ListAccessParams;
  Body: CreateListAccessRequestBody;
  Reply: ListAccessReply;
}> = async function createListAccessHandler(request) {
  try {
    const { listId } = request.params;
    const { userId } = request.body;
    const listAccess = (
      await this.database
        .insert(listAccessTable)
        .values({ listId, userId, access: 'READ_WRITE', createdBy: userId })
    )[0];

    return stringifyDates(listAccess);
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === PrismaErrorCode.ForeignKeyViolation) {
        throw this.httpErrors.badRequest('user with given id does not exist');
      }
    }

    throw error;
  }
};

export const getAllListAccessesHandler: RouteHandler<{
  Params: ListAccessParams;
  Reply: GetAllListAccessesReply;
}> = async function getAllListAccessesHandler(request) {
  const { listId } = request.params;
  const listAccesses = await this.database
    .select()
    .from(listAccessTable)
    .where(eq(listAccessTable.listId, listId));

  return listAccesses.map(stringifyDates);
};

export const deleteListAccessHandler: RouteHandler<{
  Params: DeleteListAccessParams;
  Reply: DeleteReply;
}> = async function deleteListAccessHandler(request, reply) {
  const { id } = request.params;

  const listAccess = (
    await this.database
      .delete(listAccessTable)
      .where(and(eq(listAccessTable.id, id), eq(listAccessTable.createdBy, request.user.id)))
      .returning()
  )[0];
  if (!listAccess) {
    throw this.httpErrors.notFound('list access not found');
  }

  reply.status(204).send();
};
