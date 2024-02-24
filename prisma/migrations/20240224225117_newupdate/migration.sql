/*
  Warnings:

  - Added the required column `token` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `security_pin` VARCHAR(6) NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    ADD COLUMN `ttl` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
