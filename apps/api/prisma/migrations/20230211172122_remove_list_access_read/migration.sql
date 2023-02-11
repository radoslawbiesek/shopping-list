/*
  Warnings:

  - The values [READ] on the enum `Access` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Access_new" AS ENUM ('OWNER', 'READ_WRITE');
ALTER TABLE "ListAccess" ALTER COLUMN "access" TYPE "Access_new" USING ("access"::text::"Access_new");
ALTER TYPE "Access" RENAME TO "Access_old";
ALTER TYPE "Access_new" RENAME TO "Access";
DROP TYPE "Access_old";
COMMIT;
