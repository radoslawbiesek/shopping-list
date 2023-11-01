import { RouteHandler } from 'fastify';

import { CreateListRequestBody, GetAllListsReply, ListReply } from './lists.types';
import { DeleteParams, DeleteReply } from '../common/common.schema';
import { stringifyDates } from '../utils/format';

export const createListHandler: RouteHandler<{ Body: CreateListRequestBody; Reply: ListReply }> =
  async function createListHandler(request) {
    const { id } = request.user;
    const { name } = request.body;

    const listAccess = await this.db.listAccess.create({
      data: {
        access: 'OWNER',
        createdByUser: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id,
          },
        },
        list: {
          create: {
            name,
            createdBy: id,
          },
        },
      },
    });

    const list = await this.db.list.findUnique({ where: { id: listAccess.listId } });

    return stringifyDates(list);
  };

export const getAllListsHandler: RouteHandler<{ Reply: GetAllListsReply }> =
  async function getAllCategoriesHandler(request) {
    const lists = await this.db.list.findMany({
      where: { createdBy: request.user.id },
    });

    return lists.map(stringifyDates);
  };

export const deleteListHandler: RouteHandler<{ Params: DeleteParams; Reply: DeleteReply }> =
  async function deleteListHandler(request, reply) {
    const { id } = request.params;
    const list = await this.db.list.findFirst({ where: { id, createdBy: request.user.id } });

    if (!list) {
      throw this.httpErrors.notFound('list not found');
    }

    await this.db.list.delete({ where: { id } });
    reply.status(204).send();
  };
