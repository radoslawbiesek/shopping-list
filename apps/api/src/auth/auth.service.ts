import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcrypt';

import { isPrismaError, PrismaErrorCode } from '../db/errors';
import { UserSchema } from './auth.schema';
import { getConfig } from '../config/config';

export async function createUser(
  fastify: FastifyInstance,
  userCreateInput: Prisma.UserCreateInput,
): Promise<UserSchema> {
  try {
    const { password } = userCreateInput;
    const hashedPassword = await bcrypt.hash(password, getConfig('BCRYPT_SALT_OR_ROUNDS'));
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
