import { Access } from '@prisma/client';
import { FastifyRequest, RouteHandler } from 'fastify';

import { DeleteReply } from '../common/common.schema';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';
import {
  CreateListAccessRequestBody,
  DeleteListAccessParams,
  GetAllListAccessesReply,
  ListAccessParams,
  ListAccessReply,
} from './list-access.schema';

export async function validateOwnershipPreHandler(
  request: FastifyRequest<{ Params: ListAccessParams }>,
) {
  const list = await this.db.list.findUnique({ where: { id: request.params.listId } });

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

    const listAccess = await this.db.listAccess.create({
      data: {
        listId,
        userId,
        access: Access.READ_WRITE,
        createdBy: userId,
      },
    });

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
  const listAccesses = await this.db.listAccess.findMany({
    where: { listId },
  });

  return listAccesses.map(stringifyDates);
};

export const deleteListAccessHandler: RouteHandler<{
  Params: DeleteListAccessParams;
  Reply: DeleteReply;
}> = async function deleteListAccessHandler(request, reply) {
  const { id } = request.params;
  const listAccess = await this.db.listAccess.findUnique({ where: { id } });
  if (!listAccess) {
    throw this.httpErrors.notFound('list access not found');
  }

  await this.db.listAccess.delete({ where: { id } });

  reply.status(204).send();
};
