import { Prisma } from '@prisma/client';

export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export const PrismaErrorCode = {
  UniqueKeyViolation: 'P2002',
  ForeignKeyViolation: 'P2003',
};
