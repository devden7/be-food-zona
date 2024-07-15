import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaServices } from '../../../common/prisma.service';
import { ValidationService } from '../../../common/validation.service';
import {
  IRequestFormProduct,
  IResponseFormProduct,
} from 'src/model/foods.model';
import { ProductsValidaton } from './foods.validation';

@Injectable()
export class FoodsService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaServices,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createProduct(
    request: IRequestFormProduct,
  ): Promise<IResponseFormProduct> {
    this.logger.info('Create product ' + JSON.stringify(request));

    const validationRequest = this.validationService.validate(
      ProductsValidaton.CREATE_FORM_PRODUCT,
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

    console.log(insertDataFoodAndCategory);

    return {
      message: 'Data Berhasil ditambahkan',
      food: {
        name: insertDataFoodAndCategory.name,
        description: insertDataFoodAndCategory.description,
        price: insertDataFoodAndCategory.price,
      },
    };
  }
}
