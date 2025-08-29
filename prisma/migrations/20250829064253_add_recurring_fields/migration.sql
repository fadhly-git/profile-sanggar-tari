-- AlterTable
ALTER TABLE `schedule_events` ADD COLUMN `exceptions` JSON NULL,
    ADD COLUMN `recurringEndDate` DATETIME(3) NULL;
