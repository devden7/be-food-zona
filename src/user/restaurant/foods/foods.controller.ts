import { Body, Controller, Post, Get } from '@nestjs/common';
import { FoodsService } from './foods.service';
import {
  IRequestFormProduct,
  IResponseFormProduct,
  IResponseGetFoods,
} from 'src/model/foods.model';
import { IResponseFE } from 'src/model/web.model';

@Controller('/api')
export class FoodsController {
  constructor(private foodService: FoodsService) {}

  @Post('/create-food')
  async createFood(
    @Body() request: IRequestFormProduct,
  ): Promise<IResponseFE<IResponseFormProduct>> {
    const response = await this.foodService.createProduct(request);
    return { data: response };
  }

  @Get('/restaurant-foods')
  async findFoodByRestaurant(): Promise<IResponseFE<IResponseGetFoods>> {
    const results = await this.foodService.findRestaurantFoods();
    return { data: results };
  }
}
