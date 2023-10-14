import { RouteHandler } from 'fastify';
import * as bcrypt from 'bcrypt';

import { RegisterRequestBody, UserReply, LoginRequestBody, LoginReply } from './auth.schema';
import { config } from '../config';
import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { stringifyDates } from '../utils/format';

export const registerHandler: RouteHandler<{ Body: RegisterRequestBody; Reply: UserReply }> =
  async function registerHandler(request) {
    try {
      const { name, email, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltOrRounds);
      const user = await this.db.user.create({
        data: { name, email, password: hashedPassword },
      });

      return stringifyDates(user);
    } catch (error: unknown) {
      if (isPrismaError(error)) {
        if (error.code === PrismaErrorCode.UniqueKeyViolation) {
          if (Array.isArray(error.meta.target)) {
            const fieldName = error.meta.target[0];
            throw this.httpErrors.badRequest(`${fieldName} is already taken`);
          }
        }
      }

      throw error;
    }
  };

export const loginHandler: RouteHandler<{ Body: LoginRequestBody; Reply: LoginReply }> =
  async function loginHandler(request) {
    const { email, password } = request.body;
    const user = await this.db.user.findUnique({ where: { email } });
    const isValid = user && (await bcrypt.compare(password, user.password));
    if (!isValid) {
      throw this.httpErrors.badRequest('no active account found with the given credentials');
    }

    const token = this.jwt.sign({ id: user.id, email: user.email });

    return { token, user: stringifyDates(user) };
  };

export const meHandler: RouteHandler<{ Reply: UserReply }> = async function meHandler(request) {
  const user = await this.db.user.findUnique({ where: { id: request.user.id } });

  return stringifyDates(user);
};
