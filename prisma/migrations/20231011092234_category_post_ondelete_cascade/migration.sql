-- DropForeignKey
ALTER TABLE `CategoryPost` DROP FOREIGN KEY `CategoryPost_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryPost` DROP FOREIGN KEY `CategoryPost_postId_fkey`;

-- AddForeignKey
ALTER TABLE `CategoryPost` ADD CONSTRAINT `CategoryPost_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryPost` ADD CONSTRAINT `CategoryPost_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
