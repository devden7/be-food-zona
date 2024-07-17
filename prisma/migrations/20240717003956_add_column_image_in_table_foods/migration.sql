/*
  Warnings:

  - Added the required column `image` to the `foods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "image" VARCHAR(250) NOT NULL;
