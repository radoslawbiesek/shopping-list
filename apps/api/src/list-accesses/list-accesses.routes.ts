import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Access } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import { isPrismaError, PrismaErrorCode } from '../db/errors';

import { stringifyDates } from '../utils/format';
import {
  createListAccessSchema,
  deleteListAccessSchema,
  getAllListAccessesSchema,
} from './list-accesses.schema';

const listsRoutes: FastifyPluginAsync = async (fastify) => {
  async function validateOwnership(userId: number, listId: number) {
    const list = await fastify.db.list.findUnique({ where: { id: listId } });

    if (!list) {
      throw fastify.httpErrors.notFound('list with given id does not exist');
    }

    if (list.createdBy !== userId) {
      throw fastify.httpErrors.forbidden('you do not have persmissions to perform this action');
    }
  }

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses',
    method: 'POST',
    schema: createListAccessSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateOwnership(request.user.id, request.params.listId);
    },
    async handler(request) {
      try {
        const { listId } = request.params;
        const { userId } = request.body;

        const listAccess = await fastify.db.listAccess.create({
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
            throw fastify.httpErrors.badRequest('user with given id does not exist');
          }
        }

        throw error;
      }
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses',
    method: 'GET',
    schema: getAllListAccessesSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateOwnership(request.user.id, request.params.listId);
    },
    async handler(request) {
      const { listId } = request.params;
      const listAccesses = await fastify.db.listAccess.findMany({
        where: { listId },
      });

      return listAccesses.map(stringifyDates);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:listId/accesses/:id',
    method: 'DELETE',
    schema: deleteListAccessSchema,
    onRequest: [fastify.authenticate],
    async preHandler(request) {
      await validateOwnership(request.user.id, request.params.listId);
    },
    async handler(request, reply) {
      const { id } = request.params;
      const listAccess = await fastify.db.listAccess.findUnique({ where: { id } });
      if (!listAccess) {
        throw fastify.httpErrors.notFound('list access not found');
      }

      await fastify.db.listAccess.delete({ where: { id } });
      reply.status(204).send();
    },
  });
};

export default listsRoutes;
