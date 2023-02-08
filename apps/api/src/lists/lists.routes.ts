import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

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
};

export default listsRoutes;
