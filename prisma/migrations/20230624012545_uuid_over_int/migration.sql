/*
  Warnings:

  - The primary key for the `AppliedVaccines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PetPhotos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Pets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Species` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Treatments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vaccines` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `AppliedVaccines` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `petId` VARCHAR(191) NOT NULL,
    MODIFY `vaccineId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Locations` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PetPhotos` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `petId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Pets` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `locationId` VARCHAR(191) NOT NULL,
    MODIFY `speciesId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Species` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Treatments` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `petId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    ADD COLUMN `bannedAt` DATETIME(3) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `locationId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Vaccines` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
