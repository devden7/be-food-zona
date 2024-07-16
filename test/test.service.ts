import { HttpException, Injectable } from '@nestjs/common';
import { PrismaServices } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaServices) {}

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
      where: { name: 'Junk food' },
      create: { name: 'Junk food' },
      update: {},
    });

    await this.prismaService.food.create({
      data: {
        foodId: 15,
        name: 'ayam geprek pedas',
        description: 'ayam geprek pedas description dummy',
        price: 15000,
        category: {
          create: [
            {
              categoryId: insertDataCategories.categoryId,
            },
          ],
        },
        restaurantName: 'Restaurant ayam geprek', // STILL HARD-CODED
      },
      include: { restaurant: true },
    });
  }

  async deletedDummyFood() {
    const findFood = await this.prismaService.food.findUnique({
      where: {
        foodId: 15,
        restaurantName: 'Restaurant ayam geprek', // STILL HARD-CODED
      },
    });

    if (!findFood) {
      throw new HttpException('Food not found', 404);
    }

    await this.prismaService.foodCategory.deleteMany({
      where: {
        foodId: findFood.foodId,
      },
    });

    await this.prismaService.food.deleteMany({
      where: {
        foodId: findFood.foodId,
      },
    });
  }
}
