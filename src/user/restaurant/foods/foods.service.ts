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
import { calcRating } from '../../../helper/util';
import { CloudinaryService } from '../../../common/cloudinary.service';

@Injectable()
export class FoodsService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaServices,
    private cloudinaryService: CloudinaryService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createFood(request: IRequestFormFood): Promise<IResponseFormFood> {
    this.logger.info(
      'Create product ' +
        JSON.stringify({
          foodName: request.foodName,
          description: request.description,
          request,
          price: request.price,
          category: request.category,
        }),
    );
    const validateFileImage = this.validationService.fileFilter(
      request.fileImage,
      request.image,
    );

    let fileName = null;
    if (validateFileImage !== null) {
      fileName = await this.cloudinaryService.uploadFile(request.fileImage);
    }
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
          public_id_img: !fileName ? null : fileName.public_id,
          format_img: !fileName ? null : fileName.format,
          version_img: !fileName ? null : fileName.version.toString(),
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
        public_id_img: insertDataFoodAndCategoryQuery.public_id_img,
        format_img: insertDataFoodAndCategoryQuery.format_img,
        version_img: insertDataFoodAndCategoryQuery.version_img,
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
        public_id_img: true,
        format_img: true,
        version_img: true,
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
        public_id_img: food.public_id_img,
        format_img: food.format_img,
        version_img: food.version_img,
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

    let fileName = null;
    if (validateFileImage !== null) {
      fileName = await this.cloudinaryService.uploadFile(request.fileImage);
    }

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
      data: {
        name: foodName,
        description,
        price,
        public_id_img: !fileName ? null : fileName.public_id,
        format_img: !fileName ? null : fileName.format,
        version_img: !fileName ? null : fileName.version,
      },
    });

    return {
      message: 'Data Berhasil diupdated',
      foods: {
        foodId: updateFoodQuery.foodId,
        name: updateFoodQuery.name,
        description: updateFoodQuery.description,
        price: updateFoodQuery.price,
        public_id_img: updateFoodQuery.public_id_img,
        format_img: updateFoodQuery.format_img,
        version_img: updateFoodQuery.version_img,
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
        public_id_img: deletedFoodQuery.public_id_img,
        format_img: deletedFoodQuery.format_img,
        version_img: deletedFoodQuery.version_img,
        restaurantName: deletedFoodQuery.restaurantName,
      },
    };
  }

  async getFoodlists(request: IReqFoodsLists): Promise<IResponseGetFoods> {
    this.logger.info('Foods Lists : ' + JSON.stringify(request));
    const limitFoods = request.limit ? request.limit : undefined;
    const listsParamsValid = [
      'near_me',
      'best_seller',
      'most_loved',
      'martabak',
      'bakso',
      'roti',
      'chinese',
      'burger',
      'fastfood',
      'japanese',
      'snacks',
      'sate',
      'pizza',
      'bakmie',
      'minuman',
      'korean',
      'seafood',
      'coffee',
      'indian_food',
      'middle_eastern',
    ];
    let filter;
    let takeRestaurantName;
    let aggregationsData;
    let findCategoryQuery;
    if (request.category === 'near_me') {
      filter = {
        isRecommendation: true,
        restaurant: {
          city_name: {
            contains: request.city,
            mode: 'insensitive',
          },
        },
      };
    } else if (request.category === 'best_seller') {
      aggregationsData = await this.prismaService.order.groupBy({
        by: ['restaurantName'],
        where: { status: 'Berhasil' },
        _count: { orderId: true },
        orderBy: { _count: { orderId: 'desc' } },
      });
      takeRestaurantName = aggregationsData.map((item) => item.restaurantName);
      filter = {
        isRecommendation: true,
        restaurant: {
          city_name: {
            contains: request.city,
            mode: 'insensitive',
          },
          restaurantName: { in: takeRestaurantName },
        },
      };
    } else if (request.category === 'most_loved') {
      aggregationsData = await this.prismaService.foodReview.groupBy({
        by: ['restaurantName'],
        _avg: { rating: true },
      });

      filter = {
        isRecommendation: true,
        restaurant: {
          city_name: {
            contains: request.city,
            mode: 'insensitive',
          },
        },
      };
    } else {
      if (listsParamsValid.includes(request.category)) {
        findCategoryQuery = await this.prismaService.category.findMany({
          where: {
            name: {
              contains: request.category,
              mode: 'insensitive',
            },
          },
        });

        if (findCategoryQuery.length === 0) {
          return { foods: [] };
        }
        filter = {
          restaurant: {
            city_name: {
              contains: request.city,
              mode: 'insensitive',
            },
          },
          category: {
            some: {
              category: {
                name: findCategoryQuery[0].name,
              },
            },
          },
        };
      }
    }

    const query = await this.prismaService.food.findMany({
      where: filter,
      select: {
        foodId: true,
        name: true,
        description: true,
        price: true,
        restaurantName: true,
        public_id_img: true,
        format_img: true,
        version_img: true,
        isRecommendation: true,
        restaurant: {
          select: {
            review: {
              select: { rating: true },
            },
          },
        },
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

    if (request.category === 'best_seller') {
      query.sort((a, b) => {
        const indexA = takeRestaurantName.indexOf(a.restaurantName);
        const indexB = takeRestaurantName.indexOf(b.restaurantName);
        return indexA - indexB;
      });
    } else if (request.category === 'most_loved') {
      query
        .map((food) => {
          const ratingData = aggregationsData.find(
            (rating) => rating.restaurantName === food.restaurantName,
          );
          const averageRating = ratingData ? ratingData._avg.rating : 0;

          return {
            ...food,
            averageRating,
          };
        })
        .sort((a, b) => b.averageRating - a.averageRating);
    }

    const finalResultQuery = query.map((food) => {
      return {
        foodId: food.foodId,
        name: food.name,
        description: food.description,
        price: food.price,
        restaurantName: food.restaurantName,
        public_id_img: food.public_id_img,
        format_img: food.format_img,
        version_img: food.version_img,
        isRecommendation: food.isRecommendation,
        rating: calcRating(food.restaurant.review),
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
          equals: restaurantName,
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
          equals: restaurantName,
          mode: 'insensitive',
        },
      },
      select: {
        foodId: true,
        name: true,
        description: true,
        price: true,
        restaurantName: true,
        public_id_img: true,
        format_img: true,
        version_img: true,
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
        public_id_img: food.public_id_img,
        format_img: food.format_img,
        version_img: food.version_img,
        category: food.category.map((value) => value.category.name),
        isRecommendation: food.isRecommendation,
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
        restaurantName: restaurantName,
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
