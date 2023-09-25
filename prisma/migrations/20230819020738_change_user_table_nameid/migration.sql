/*
  Warnings:

  - Made the column `nameid` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `nameid` VARCHAR(191) NOT NULL;
