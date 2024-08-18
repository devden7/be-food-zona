/*
  Warnings:

  - You are about to drop the column `image` on the `foods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "foods" DROP COLUMN "image",
ADD COLUMN     "format_img" VARCHAR(250),
ADD COLUMN     "public_id_img" VARCHAR(500),
ADD COLUMN     "version_img" VARCHAR(250);
