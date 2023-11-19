import { RouteHandler } from 'fastify';
import { and, eq } from 'drizzle-orm';

import { CreateListRequestBody, GetAllListsReply, ListReply } from './lists.types';
import { DeleteParams, DeleteReply } from '../common/common.types';
import { stringifyDates } from '../utils/format';
import { listAccessTable, listTable } from '../database/schema';

export const createListHandler: RouteHandler<{ Body: CreateListRequestBody; Reply: ListReply }> =
  async function createListHandler(request) {
    const { id } = request.user;
    const { name } = request.body;

    const list = (
      await this.database.insert(listTable).values({ name, createdBy: id }).returning()
    )[0];

    await this.database.insert(listAccessTable).values({
      access: 'OWNER',
      createdBy: id,
      userId: id,
      listId: list.id,
    });

    return stringifyDates(list);
  };

export const getAllListsHandler: RouteHandler<{ Reply: GetAllListsReply }> =
  async function getAllCategoriesHandler(request) {
    const lists = await this.database
      .select()
      .from(listTable)
      .where(eq(listTable.createdBy, request.user.id));

    return lists.map(stringifyDates);
  };

export const deleteListHandler: RouteHandler<{ Params: DeleteParams; Reply: DeleteReply }> =
  async function deleteListHandler(request, reply) {
    const { id } = request.params;
    const list = (
      await this.database
        .delete(listTable)
        .where(and(eq(listTable.id, id), eq(listTable.createdBy, request.user.id)))
        .returning()
    )[0];

    if (!list) {
      throw this.httpErrors.notFound('list not found');
    }

    reply.status(204).send();
  };
