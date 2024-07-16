import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import {
  IRequestFormFood,
  IRequestFormUpdateFood,
  IResponseFormFood,
  IResponseGetFoods,
} from 'src/model/foods.model';
import { IResponseFE } from 'src/model/web.model';

@Controller('/api')
export class FoodsController {
  constructor(private foodService: FoodsService) {}

  @Post('/create-food')
  async createFood(
    @Body() request: IRequestFormFood,
  ): Promise<IResponseFE<IResponseFormFood>> {
    const response = await this.foodService.createFood(request);
    return { data: response };
  }

  @Get('/restaurant-foods')
  async findFoodByRestaurant(): Promise<IResponseFE<IResponseGetFoods>> {
    const results = await this.foodService.findRestaurantFoods();
    return { data: results };
  }

  @Put(`/update/:foodId`)
  async updateFoodById(
    @Param('foodId', ParseIntPipe) foodId: number,
    @Body() request: IRequestFormUpdateFood,
  ): Promise<IResponseFE<IResponseFormFood>> {
    const results = await this.foodService.editFood({ foodId, ...request });
    return { data: results };
  }
  @Delete('/delete/:foodId')
  async deleteById(
    @Param('foodId', ParseIntPipe) foodId: number,
  ): Promise<IResponseFE<IResponseFormFood>> {
    const results = await this.foodService.deleteFood(foodId);
    return { data: results };
  }
}
