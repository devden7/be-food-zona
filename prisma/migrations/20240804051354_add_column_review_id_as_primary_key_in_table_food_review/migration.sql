-- AlterTable
ALTER TABLE "food_reviews" ADD COLUMN     "reviewId" SERIAL NOT NULL,
ADD CONSTRAINT "food_reviews_pkey" PRIMARY KEY ("reviewId");
