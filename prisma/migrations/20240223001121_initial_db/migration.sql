-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `profile_pic` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `birthday` DATETIME(3) NULL,
    `gender` VARCHAR(10) NULL,
    `location` VARCHAR(255) NULL,
    `nin` VARCHAR(20) NULL,
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_nin_key`(`nin`),
    INDEX `users_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
