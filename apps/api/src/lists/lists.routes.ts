import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { deleteSchema } from '../common/common.schema';

import { stringifyDates } from '../utils/format';
import { createListSchema, getAllListsSchema } from './lists.schema';

const listsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists',
    method: 'POST',
    onRequest: [fastify.authenticate],
    schema: createListSchema,
    async handler(request) {
      const { name } = request.body;
      const list = await fastify.db.list.create({
        data: {
          name,
          createdBy: request.user.id,
        },
      });

      return stringifyDates(list);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: getAllListsSchema,
    async handler(request) {
      const lists = await fastify.db.list.findMany({
        where: { createdBy: request.user.id },
      });

      return lists.map(stringifyDates);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/lists/:id',
    method: 'DELETE',
    onRequest: [fastify.authenticate],
    schema: deleteSchema,
    async handler(request, reply) {
      const { id } = request.params;
      const list = await fastify.db.list.findFirst({ where: { id, createdBy: request.user.id } });

      if (!list) {
        throw fastify.httpErrors.notFound('list not found');
      }

      await fastify.db.list.delete({ where: { id } });
      reply.status(204).send();
    },
  });
};

export default listsRoutes;
