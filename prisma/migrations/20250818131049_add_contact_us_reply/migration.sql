/*
  Warnings:

  - You are about to drop the column `isRead` on the `contact_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contact_submissions` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact_submissions` DROP COLUMN `isRead`,
    DROP COLUMN `phone`,
    ADD COLUMN `repliedAt` DATETIME(3) NULL,
    ADD COLUMN `replyMessage` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'REPLIED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
