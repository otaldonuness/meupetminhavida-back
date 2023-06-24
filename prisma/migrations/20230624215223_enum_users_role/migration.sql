/*
  Warnings:

  - You are about to drop the column `hashRT` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(0))`.
  - Added the required column `hashedPassword` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `hashRT`,
    DROP COLUMN `password`,
    ADD COLUMN `hashedPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `hashedRefreshToken` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ONG', 'ADMIN', 'REGULAR') NOT NULL DEFAULT 'REGULAR';
