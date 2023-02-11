-- CreateEnum
CREATE TYPE "Access" AS ENUM ('OWNER', 'READ_WRITE', 'READ');

-- CreateTable
CREATE TABLE "ListAccess" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "access" "Access" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ListAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListAccess" ADD CONSTRAINT "ListAccess_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListAccess" ADD CONSTRAINT "ListAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
