-- CreateTable
CREATE TABLE "order_item" (
    "orderItemId" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("orderItemId")
);

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("foodId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
