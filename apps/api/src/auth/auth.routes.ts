import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { stringifyDates } from '../utils/format';
import * as bcrypt from 'bcrypt';

import { loginSchema, meSchema, registerSchema } from './auth.schema';
import { config } from '../config';
import { isPrismaError, PrismaErrorCode } from '../db/errors';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/register',
    method: 'POST',
    schema: registerSchema,
    async handler(request) {
      try {
        const { name, email, password } = request.body;
        const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltOrRounds);
        const user = await fastify.db.user.create({
          data: { name, email, password: hashedPassword },
        });

        return stringifyDates(user);
      } catch (error: unknown) {
        if (isPrismaError(error)) {
          if (error.code === PrismaErrorCode.UniqueKeyViolation) {
            if (Array.isArray(error.meta.target)) {
              const fieldName = error.meta.target[0];
              throw fastify.httpErrors.badRequest(`${fieldName} is already taken`);
            }
          }
        }

        throw error;
      }
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/login',
    method: 'POST',
    schema: loginSchema,
    async handler(request) {
      const { email, password } = request.body;
      const user = await fastify.db.user.findUnique({ where: { email } });
      const isValid = user && (await bcrypt.compare(password, user.password));
      if (!isValid) {
        throw fastify.httpErrors.badRequest('no active account found with the given credentials');
      }

      const token = await fastify.jwt.sign(user);

      return { token };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'GET',
    onRequest: [fastify.authenticate],
    schema: meSchema,
    async handler(request) {
      const user = await fastify.db.user.findUnique({ where: { id: request.user.id } });

      return stringifyDates(user);
    },
  });
};

export default authRoutes;
