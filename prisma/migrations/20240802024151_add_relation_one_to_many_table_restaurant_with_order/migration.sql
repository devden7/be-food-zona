/*
  Warnings:

  - Added the required column `restaurantName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "restaurantName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantName_fkey" FOREIGN KEY ("restaurantName") REFERENCES "restaurant"("restaurantName") ON DELETE RESTRICT ON UPDATE CASCADE;
