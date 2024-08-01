/*
  Warnings:

  - The primary key for the `food_reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order_id` on the `food_reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `food_reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `food_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "food_reviews" DROP CONSTRAINT "food_reviews_order_id_fkey";

-- AlterTable
ALTER TABLE "food_reviews" DROP CONSTRAINT "food_reviews_pkey",
DROP COLUMN "order_id",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "food_reviews_orderId_key" ON "food_reviews"("orderId");

-- AddForeignKey
ALTER TABLE "food_reviews" ADD CONSTRAINT "food_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
