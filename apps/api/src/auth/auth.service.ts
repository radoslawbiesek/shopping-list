import { Prisma, User } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcrypt';

import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { UserSchema } from './auth.schema';
import { getEnvVariable } from '../config/config';

export async function createUser(
  fastify: FastifyInstance,
  userCreateInput: Prisma.UserCreateInput,
): Promise<UserSchema> {
  try {
    const { password } = userCreateInput;
    const hashedPassword = await bcrypt.hash(password, getEnvVariable('BCRYPT_SALT_OR_ROUNDS'));
    const user = await fastify.db.user.create({
      data: { ...userCreateInput, password: hashedPassword },
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
    };
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
}

export async function getUserByEmail(fastify: FastifyInstance, email: string): Promise<UserSchema> {
  const user = await fastify.db.user.findFirst({ where: { email } });
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.createdAt.toISOString(),
  };
}

export async function validatePassword(
  fastify: FastifyInstance,
  userLoginInput: { email: string; password: string },
): Promise<User> {
  try {
    const { email, password } = userLoginInput;
    const user = await fastify.db.user.findFirst({ where: { email } });
    const isValid = user && (await bcrypt.compare(password, user.password));
    if (!isValid) {
      throw fastify.httpErrors.badRequest('no active account found with the given credentials');
    }

    return user;
  } catch (error) {
    throw fastify.httpErrors.badRequest('no active account found with the given credentials');
  }
}

export async function createToken(
  fastify: FastifyInstance,
  user: User,
): Promise<{ token: string }> {
  const { email, id } = user;
  const payload = { email, id };
  const token = fastify.jwt.sign(payload);

  return { token };
}
