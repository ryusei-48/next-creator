/*
  Warnings:

  - You are about to alter the column `title` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `title` JSON NOT NULL;
