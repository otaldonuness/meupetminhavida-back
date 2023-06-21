/*
  Warnings:

  - You are about to drop the column `caseId` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `isOng` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `ongWebsite` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `CasePhotos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciesId` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Pets_caseId_key` ON `Pets`;

-- AlterTable
ALTER TABLE `Pets` DROP COLUMN `caseId`,
    DROP COLUMN `type`,
    ADD COLUMN `locationId` INTEGER NOT NULL,
    ADD COLUMN `speciesId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `isOng`,
    DROP COLUMN `ongWebsite`,
    ADD COLUMN `hashRT` VARCHAR(255) NULL,
    ADD COLUMN `locationId` INTEGER NOT NULL,
    ADD COLUMN `role` VARCHAR(10) NOT NULL,
    MODIFY `description` VARCHAR(200) NULL;

-- DropTable
DROP TABLE `CasePhotos`;

-- DropTable
DROP TABLE `Cases`;

-- CreateTable
CREATE TABLE `Locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetPhotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photoURL` VARCHAR(300) NOT NULL,
    `isMainPicture` BOOLEAN NOT NULL,
    `petId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PetPhotos_petId_idx`(`petId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Pets_locationId_idx` ON `Pets`(`locationId`);

-- CreateIndex
CREATE INDEX `Pets_speciesId_idx` ON `Pets`(`speciesId`);

-- CreateIndex
CREATE INDEX `Users_locationId_idx` ON `Users`(`locationId`);
