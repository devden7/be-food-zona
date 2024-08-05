import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaServices } from '../../../common/prisma.service';
import { ValidationService } from '../../../common/validation.service';
import {
  IReqFoodsLists,
  IRequestFormFood,
  IRequestFormUpdateFood,
  IResponseFormFood,
  IResponseGetFoods,
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

    const insertDataCategoriesQuery = await this.prismaService.category.upsert({
      where: { name: category },
      create: { name: category },
      update: {},
    });

    const insertDataFoodAndCategoryQuery = await this.prismaService.food.create(
      {
        data: {
          name: foodName,
          description,
          price,
          image: validateFileImage,
          category: {
            create: [
              {
                categoryId: insertDataCategoriesQuery.categoryId,
              },
            ],
          },
          restaurantName: request.userRestaurant,
        },
        include: { restaurant: true },
      },
    );

    return {
      message: 'Data Berhasil ditambahkan',
      foods: {
        foodId: insertDataFoodAndCategoryQuery.foodId,
        name: insertDataFoodAndCategoryQuery.name,
        description: insertDataFoodAndCategoryQuery.description,
        price: insertDataFoodAndCategoryQuery.price,
        image: insertDataFoodAndCategoryQuery.image,
        restaurantName: insertDataFoodAndCategoryQuery.restaurantName,
      },
    };
  }

  async findRestaurantFoods(userRestaurant: string | null) {
    const findFoodQuery = await this.prismaService.food.findMany({
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
        isRecommendation: true,
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

    const finalResultQuery = findFoodQuery.map((food) => {
      return {
        foodId: food.foodId,
        name: food.name,
        description: food.description,
        price: food.price,
        restaurantName: food.restaurantName,
        image: food.image,
        isRecommendation: food.isRecommendation,
        category: food.category.map((value) => value.category.name),
      };
    });
    const sortFood = finalResultQuery.sort((a, b) => {
      const foodA =
        a.isRecommendation === true ? 1 : a.isRecommendation === false ? 0 : -1;
      const foodB =
        b.isRecommendation === true ? 1 : b.isRecommendation === false ? 0 : -1;
      return foodB - foodA;
    });

    return { foods: sortFood };
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

    const { foodName, description, price } = validationRequest;

    const findFoodQuery = await this.prismaService.food.findUnique({
      where: {
        foodId: request.foodId,
        restaurantName: request.userRestaurant,
      },
    });

    if (!findFoodQuery) {
      throw new HttpException('Food not found', 404);
    }

    const updateFoodQuery = await this.prismaService.food.update({
      where: {
        foodId: findFoodQuery.foodId,
        restaurantName: findFoodQuery.restaurantName,
      },
      data: { name: foodName, description, price, image: validateFileImage },
    });

    return {
      message: 'Data Berhasil diupdated',
      foods: {
        foodId: updateFoodQuery.foodId,
        name: updateFoodQuery.name,
        description: updateFoodQuery.description,
        price: updateFoodQuery.price,
        image: updateFoodQuery.image,
        restaurantName: updateFoodQuery.restaurantName,
      },
    };
  }

  async deleteFood(
    paramsId: number,
    userRestaurant: string,
  ): Promise<IResponseFormFood> {
    this.logger.info('Delete food : ' + JSON.stringify(paramsId));

    const findFoodQuery = await this.prismaService.food.findUnique({
      where: {
        foodId: paramsId,
        restaurantName: userRestaurant,
      },
    });

    if (!findFoodQuery) {
      throw new HttpException('Food not found', 404);
    }

    await this.prismaService.foodCategory.deleteMany({
      where: {
        foodId: findFoodQuery.foodId,
      },
    });

    const deletedFoodQuery = await this.prismaService.food.delete({
      where: {
        foodId: findFoodQuery.foodId,
      },
    });

    return {
      message: 'Data Berhasil dihapus',
      foods: {
        name: deletedFoodQuery.name,
        description: deletedFoodQuery.description,
        price: deletedFoodQuery.price,
        image: deletedFoodQuery.image,
        restaurantName: deletedFoodQuery.restaurantName,
      },
    };
  }

  async getFoodlists(request: IReqFoodsLists): Promise<IResponseGetFoods> {
    this.logger.info('Foods Lists : ' + request);
    const limitFoods = request.limit ? request.limit : undefined;
    const query = await this.prismaService.food.findMany({
      where: {
        restaurant: {
          city_name: {
            contains: request.city,
            mode: 'insensitive',
          },
        },
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
      take: limitFoods,
    });
    const finalResultQuery = query.map((food) => {
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
    return { foods: finalResultQuery };
  }

  async getFoodListDetail(restaurantName: string): Promise<IResponseGetFoods> {
    this.logger.info('Restaurant name : ' + JSON.stringify(restaurantName));

    const findRestaurantQuery = await this.prismaService.restaurant.findFirst({
      where: {
        restaurantName: {
          contains: restaurantName,
          mode: 'insensitive',
        },
      },
    });

    if (!findRestaurantQuery) {
      throw new HttpException('Restaurant not found', 400);
    }

    const getFoodQuery = await this.prismaService.food.findMany({
      where: {
        restaurantName: {
          contains: restaurantName,
          mode: 'insensitive',
        },
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
        restaurant: {
          select: {
            review: {
              select: {
                reviewId: true,
                username: true,
                rating: true,
                comment: true,
                restaurantName: true,
                order: {
                  select: {
                    createAt: true,
                    orderItem: {
                      select: {
                        orderItemId: true,
                        foodNameOrder: true,
                      },
                    },
                  },
                },
                user: { select: { createAt: true } },
              },
            },
          },
        },
      },
    });

    const finalResultQuery = getFoodQuery.map((food) => {
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
    return {
      foods: finalResultQuery,
      restaurantName: restaurantName,
      reviews: getFoodQuery[0].restaurant.review,
    };
  }

  async addRecommendationFoods(restaurantName: string, foodId: number) {
    this.logger.info('Recommendation : ', restaurantName);

    const findFoodQuery = await this.prismaService.food.findUnique({
      where: {
        foodId: foodId,
        restaurantName: restaurantName,
      },
    });

    if (!findFoodQuery) {
      throw new HttpException('Food not found', 404);
    }

    const findFoodRecommendation = await this.prismaService.food.findFirst({
      where: {
        isRecommendation: true,
      },
    });

    if (findFoodRecommendation) {
      await this.prismaService.food.update({
        where: {
          foodId: findFoodRecommendation.foodId,
        },
        data: {
          isRecommendation: false,
        },
      });
    }
    await this.prismaService.food.update({
      where: {
        foodId: foodId,
      },
      data: {
        isRecommendation: true,
      },
    });

    return { message: 'Successfully added food as a Recommendation' };
  }
}
