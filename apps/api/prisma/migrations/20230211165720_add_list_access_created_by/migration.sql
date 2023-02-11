/*
  Warnings:

  - Added the required column `createdBy` to the `ListAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListAccess" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ListAccess" ADD CONSTRAINT "ListAccess_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
