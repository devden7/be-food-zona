import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaServices } from '../../../common/prisma.service';
import { ValidationService } from '../../../common/validation.service';
import {
  IRequestFormFood,
  IRequestFormUpdateFood,
  IResponseFormFood,
} from 'src/model/foods.model';
import { FoodValidaton } from './foods.validation';

@Injectable()
export class FoodsService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaServices,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createFood(request: IRequestFormFood): Promise<IResponseFormFood> {
    this.logger.info('Create product ' + JSON.stringify(request));

    const validationRequest = this.validationService.validate(
      FoodValidaton.CREATE_FORM_FOOD,
      request,
    );

    const { foodName, description, price, category } = validationRequest;

    const insertDataCategories = await this.prismaService.category.upsert({
      where: { name: category },
      create: { name: category },
      update: {},
    });

    const insertDataFoodAndCategory = await this.prismaService.food.create({
      data: {
        name: foodName,
        description,
        price,
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

    return {
      message: 'Data Berhasil ditambahkan',
      food: {
        name: insertDataFoodAndCategory.name,
        description: insertDataFoodAndCategory.description,
        price: insertDataFoodAndCategory.price,
      },
    };
  }

  async findRestaurantFoods() {
    const results = await this.prismaService.food.findMany({
      where: { restaurantName: 'Restaurant ayam penyet' }, // STILL HARD-CODED
    });
    return { foods: results };
  }

  async editFood(request: IRequestFormUpdateFood): Promise<IResponseFormFood> {
    this.logger.info('Edit Food:' + JSON.stringify(request));

    const validationRequest = this.validationService.validate(
      FoodValidaton.UPDATE_FORM_FOOD,
      request,
    );

    const { foodName, description, price } = validationRequest;

    const updateFood = await this.prismaService.food.update({
      where: {
        foodId: request.foodId,
        restaurantName: 'Restaurant ayam penyet', // STILL HARD-CODED
      },
      data: { name: foodName, description, price },
    });

    console.log(updateFood);
    return {
      message: 'Data Berhasil diupdated',
      food: {
        name: updateFood.name,
        description: updateFood.description,
        price: updateFood.price,
      },
    };
  }
}
