-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_thumbnail_fkey`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_thumbnail_fkey` FOREIGN KEY (`thumbnail`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
