import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteParamsSchema, deleteReplySchema } from '../common/common.schema';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
} from './categories.handlers';
import {
  createCategoryRequestBodySchema,
  categoryReplySchema,
  allCategoriesReplySchema,
} from './categories.schema';

const categoriesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', app.authenticate);

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories',
    method: 'POST',
    schema: {
      body: createCategoryRequestBodySchema,
      response: {
        200: categoryReplySchema,
      },
    },
    handler: createCategoryHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories',
    method: 'GET',
    schema: {
      response: {
        200: allCategoriesReplySchema,
      },
    },
    handler: getAllCategoriesHandler,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/categories/:id',
    method: 'DELETE',
    schema: {
      params: deleteParamsSchema,
      response: {
        204: deleteReplySchema,
      },
    },
    handler: deleteCategoryHandler,
  });
};

export default categoriesRoutes;
