/*
  Warnings:

  - Made the column `parent` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `parent` INTEGER NOT NULL DEFAULT 0;
