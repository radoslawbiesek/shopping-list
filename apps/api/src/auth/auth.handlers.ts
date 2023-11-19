import { RouteHandler } from 'fastify';
import * as bcrypt from 'bcrypt';
import { PostgresError } from 'postgres';
import { eq } from 'drizzle-orm';

import { RegisterRequestBody, UserReply, LoginRequestBody, LoginReply } from './auth.types';
import { config } from '../config';
import { stringifyDates } from '../utils/format';
import { userTable } from '../database/schema';
import { DbErrorCode } from '../database/errors';

export const registerHandler: RouteHandler<{ Body: RegisterRequestBody; Reply: UserReply }> =
  async function registerHandler(request) {
    try {
      const { name, email, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltOrRounds);
      const user = (
        await this.database
          .insert(userTable)
          .values({ email, name, password: hashedPassword })
          .returning()
      )[0];

      return stringifyDates(user);
    } catch (error: unknown) {
      if (error instanceof PostgresError) {
        if (error.code === DbErrorCode.UniqueViolation) {
          switch (error.constraint_name) {
            case 'User_email_key':
              throw this.httpErrors.badRequest('email is already taken');
            case 'User_name_key':
              throw this.httpErrors.badRequest('name is already taken');
          }
        }
      }

      throw error;
    }
  };

export const loginHandler: RouteHandler<{ Body: LoginRequestBody; Reply: LoginReply }> =
  async function loginHandler(request) {
    const { email, password } = request.body;
    const user = (
      await this.database.select().from(userTable).where(eq(userTable.email, email))
    )[0];

    const isValid = user && (await bcrypt.compareSync(password, user.password));
    if (!isValid) {
      throw this.httpErrors.badRequest('no active account found with the given credentials');
    }

    const token = this.jwt.sign({ id: user.id, email: user.email });

    return { token, user: stringifyDates(user) };
  };

export const meHandler: RouteHandler<{ Reply: UserReply }> = async function meHandler(request) {
  const user = (
    await this.database.select().from(userTable).where(eq(userTable.id, request.user.id))
  )[0];

  return stringifyDates(user);
};
