/*
  Warnings:

  - Added the required column `foodNameOrder` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "foodNameOrder" TEXT NOT NULL;
