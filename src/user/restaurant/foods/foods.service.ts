import { HttpException, Inject, Injectable } from '@nestjs/common';
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
    const validateFileImage = this.validationService.fileFilter(
      request.fileImage,
      request.image,
    );

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
        image: validateFileImage,
        category: {
          create: [
            {
              categoryId: insertDataCategories.categoryId,
            },
          ],
        },
        restaurantName: request.userRestaurant,
      },
      include: { restaurant: true },
    });

    return {
      message: 'Data Berhasil ditambahkan',
      foods: {
        foodId: insertDataFoodAndCategory.foodId,
        name: insertDataFoodAndCategory.name,
        description: insertDataFoodAndCategory.description,
        price: insertDataFoodAndCategory.price,
        image: insertDataFoodAndCategory.image,
        restaurantName: insertDataFoodAndCategory.restaurantName,
      },
    };
  }

  async findRestaurantFoods(userRestaurant: string | null) {
    const results = await this.prismaService.food.findMany({
      where: {
        restaurantName: userRestaurant,
      },
      select: {
        foodId: true,
        name: true,
        description: true,
        price: true,
        restaurantName: true,
        image: true,
        category: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const finalResult = results.map((food) => {
      return {
        foodId: food.foodId,
        name: food.name,
        description: food.description,
        price: food.price,
        restaurantName: food.restaurantName,
        image: food.image,
        category: food.category.map((value) => value.category.name),
      };
    });

    return { foods: finalResult };
  }

  async editFood(request: IRequestFormUpdateFood): Promise<IResponseFormFood> {
    this.logger.info('Edit Food:' + JSON.stringify(request));

    const validateFileImage = this.validationService.fileFilter(
      request.fileImage,
      request.image,
    );

    const validationRequest = this.validationService.validate(
      FoodValidaton.UPDATE_FORM_FOOD,
      request,
    );

    const { foodName, description, price, image } = validationRequest;

    const findFood = await this.prismaService.food.findUnique({
      where: {
        foodId: request.foodId,
        restaurantName: request.userRestaurant, // STILL HARD-CODED
      },
    });

    if (!findFood) {
      throw new HttpException('Food not found', 404);
    }

    const updateFood = await this.prismaService.food.update({
      where: {
        foodId: findFood.foodId,
        restaurantName: findFood.restaurantName, // STILL HARD-CODED
      },
      data: { name: foodName, description, price, image: validateFileImage },
    });

    return {
      message: 'Data Berhasil diupdated',
      foods: {
        foodId: updateFood.foodId,
        name: updateFood.name,
        description: updateFood.description,
        price: updateFood.price,
        image: updateFood.image,
        restaurantName: updateFood.restaurantName,
      },
    };
  }

  async deleteFood(
    paramsId: number,
    userRestaurant: string,
  ): Promise<IResponseFormFood> {
    this.logger.info('Delete food : ' + JSON.stringify(paramsId));

    const findFood = await this.prismaService.food.findUnique({
      where: {
        foodId: paramsId,
        restaurantName: userRestaurant,
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

    const deleteFood = await this.prismaService.food.delete({
      where: {
        foodId: findFood.foodId,
      },
    });

    return {
      message: 'Data Berhasil dihapus',
      foods: {
        name: deleteFood.name,
        description: deleteFood.description,
        price: deleteFood.price,
        image: deleteFood.image,
        restaurantName: deleteFood.restaurantName,
      },
    };
  }
}
