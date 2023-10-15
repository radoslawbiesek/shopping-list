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
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .addHook('onRequest', app.authenticate)
    .get('/categories', {
      schema: {
        response: {
          200: allCategoriesReplySchema,
        },
      },
      handler: getAllCategoriesHandler,
    })
    .post('/categories', {
      schema: {
        body: createCategoryRequestBodySchema,
        response: {
          200: categoryReplySchema,
        },
      },
      handler: createCategoryHandler,
    })
    .delete('/categories/:id', {
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
