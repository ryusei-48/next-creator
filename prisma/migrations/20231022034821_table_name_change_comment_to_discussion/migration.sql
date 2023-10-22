/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_post_id_fkey`;

-- DropTable
DROP TABLE `Comment`;

-- CreateTable
CREATE TABLE `Discussion` (
    `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `nicname` VARCHAR(40) NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `sender_info` JSON NOT NULL,
    `parent_id` MEDIUMINT NOT NULL DEFAULT 0,
    `register_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Discussion` ADD CONSTRAINT `Discussion_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
