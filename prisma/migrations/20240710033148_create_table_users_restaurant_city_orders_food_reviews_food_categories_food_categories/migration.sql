-- CreateTable
CREATE TABLE "users" (
    "name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "restaurantName" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("restaurantName")
);

-- CreateTable
CREATE TABLE "city" (
    "city_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("city_name")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderId" SERIAL NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "foodNameOrder" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "food_reviews" (
    "username" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_reviews_pkey" PRIMARY KEY ("username","order_id")
);

-- CreateTable
CREATE TABLE "foods" (
    "foodId" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "price" INTEGER NOT NULL,
    "restaurantName" VARCHAR(50) NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("foodId")
);

-- CreateTable
CREATE TABLE "categories" (
    "categoryId" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "food" VARCHAR(20) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "food_categories" (
    "foodId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_categories_pkey" PRIMARY KEY ("categoryId","foodId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_username_key" ON "restaurant"("username");

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_city_name_fkey" FOREIGN KEY ("city_name") REFERENCES "city"("city_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_reviews" ADD CONSTRAINT "food_reviews_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_reviews" ADD CONSTRAINT "food_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_restaurantName_fkey" FOREIGN KEY ("restaurantName") REFERENCES "restaurant"("restaurantName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_categories" ADD CONSTRAINT "food_categories_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("foodId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_categories" ADD CONSTRAINT "food_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
