/*
  Warnings:

  - You are about to drop the column `userId` on the `files` table. All the data in the column will be lost.
  - Added the required column `folderId` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_userId_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "userId",
ADD COLUMN     "folderId" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
