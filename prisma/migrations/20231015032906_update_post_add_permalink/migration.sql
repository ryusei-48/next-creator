/*
  Warnings:

  - A unique constraint covering the columns `[permalink]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `permalink` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_permalink_key` ON `Post`(`permalink`);
