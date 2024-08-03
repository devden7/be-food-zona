/*
  Warnings:

  - Added the required column `restaurantName` to the `food_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_reviews" ADD COLUMN     "restaurantName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "food_reviews" ADD CONSTRAINT "food_reviews_restaurantName_fkey" FOREIGN KEY ("restaurantName") REFERENCES "restaurant"("restaurantName") ON DELETE RESTRICT ON UPDATE CASCADE;
