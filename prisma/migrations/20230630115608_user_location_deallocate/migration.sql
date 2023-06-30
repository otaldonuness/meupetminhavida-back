/*
  Warnings:

  - You are about to alter the column `locationId` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `locationId` INTEGER NOT NULL;
