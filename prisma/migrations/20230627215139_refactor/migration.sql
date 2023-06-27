/*
  Warnings:

  - Added the required column `zip` to the `Locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Locations` ADD COLUMN `zip` VARCHAR(8) NOT NULL;
