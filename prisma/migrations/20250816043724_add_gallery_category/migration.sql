/*
  Warnings:

  - You are about to drop the column `category` on the `gallery_items` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `gallery_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gallery_items` DROP COLUMN `category`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `gallery_categories` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `gallery_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gallery_categories` ADD CONSTRAINT `gallery_categories_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery_items` ADD CONSTRAINT `gallery_items_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `gallery_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
