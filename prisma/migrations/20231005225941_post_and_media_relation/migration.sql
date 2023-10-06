/*
  Warnings:

  - You are about to alter the column `body` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `Json`.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `thumbnail` INTEGER NULL,
    MODIFY `body` JSON NOT NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_thumbnail_fkey` FOREIGN KEY (`thumbnail`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
