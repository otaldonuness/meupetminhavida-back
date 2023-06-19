/*
  Warnings:

  - You are about to drop the column `whatsapp` on the `Users` table. All the data in the column will be lost.
  - Added the required column `mobileNumber` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `whatsapp`,
    ADD COLUMN `mobileNumber` VARCHAR(11) NOT NULL;
