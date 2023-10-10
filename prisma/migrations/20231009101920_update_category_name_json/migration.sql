/*
  Warnings:

  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `name` JSON NOT NULL;
