import { HttpException, Injectable } from '@nestjs/common';
import { PrismaServices } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaServices) {}

  async deleteAll() {
    await this.deleteDummyReview();
    await this.deleteDummyOrder();
    await this.deletedDummyFood();
    await this.deleteDummyRestaurant();
    await this.deleteDummyUser();
  }

  async createDummyRestaurant() {
    const insertDataCity = await this.prismaService.city.upsert({
      where: { city_name: 'jakarta' },
      update: {},
      create: { city_name: 'jakarta' },
      include: {
        restaurant: true,
      },
    });
    await this.prismaService.restaurant.create({
      data: {
        restaurantName: 'restaurant1',
        city_name: insertDataCity.city_name,
        username: 'test1',
      },
      include: {
        city: true,
        user: true,
      },
    });
  }
  async deleteDummyRestaurant() {
    await this.prismaService.restaurant.deleteMany({
      where: { username: 'test1' },
    });
  }

  async createDummyUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test1',
        name: 'test1',
        password: await bcrypt.hash('123456', 7),
      },
    });
  }

  async deleteDummyUser() {
    await this.prismaService.user.deleteMany({
      where: { username: 'test1' },
    });
  }

  async createDummyFood() {
    const insertDataCategories = await this.prismaService.category.upsert({
      where: { name: 'category1' },
      create: { name: 'category1' },
      update: {},
    });

    await this.prismaService.food.create({
      data: {
        foodId: 15,
        name: 'test food1',
        description: 'test description food1',
        price: 1000,
        category: {
          create: [
            {
              categoryId: insertDataCategories.categoryId,
            },
          ],
        },
        restaurantName: 'restaurant1',
      },
      include: { restaurant: true },
    });

    const insertDataCategoriesTwo = await this.prismaService.category.upsert({
      where: { name: 'category2' },
      create: { name: 'category2' },
      update: {},
    });

    await this.prismaService.food.create({
      data: {
        foodId: 16,
        name: 'test food2',
        description: 'test description food2',
        price: 2000,
        category: {
          create: [
            {
              categoryId: insertDataCategoriesTwo.categoryId,
            },
          ],
        },
        restaurantName: 'restaurant2',
      },
      include: { restaurant: true },
    });
  }

  async deletedDummyFood() {
    await this.prismaService.foodCategory.deleteMany();

    await this.prismaService.food.deleteMany();
  }

  async createDummyOrder() {
    await this.prismaService.order.create({
      data: {
        orderId: 1,
        totalPrice: 1000,
        totalQuantity: 1,
        status: 'Pending',
        restaurantName: 'restaurant2',
        username: 'test1',
      },
    });

    await this.prismaService.orderItem.createMany({
      data: {
        orderId: 1,
        orderItemId: 1,
        foodNameOrder: 'test food2',
      },
    });
  }

  async deleteDummyOrder() {
    await this.prismaService.orderItem.deleteMany();
    await this.prismaService.order.deleteMany();
  }

  async createDummyReview() {
    await this.prismaService.foodReview.create({
      data: {
        reviewId: 1,
        rating: 5,
        comment: 'Best food ever',
        restaurantName: 'restaurant2',
        username: 'test1',
        orderId: 1,
      },
    });
  }

  async deleteDummyReview() {
    await this.prismaService.foodReview.deleteMany();
  }
}
