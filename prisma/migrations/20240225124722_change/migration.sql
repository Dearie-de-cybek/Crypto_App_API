/*
  Warnings:

  - You are about to alter the column `ttl` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `token` VARCHAR(191) NULL,
    MODIFY `ttl` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3);
