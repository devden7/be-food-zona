-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("foodId") ON DELETE RESTRICT ON UPDATE CASCADE;
