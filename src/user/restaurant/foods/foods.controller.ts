import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FoodsService } from './foods.service';
import {
  IReqFoodsLists,
  IRequestFormFood,
  IRequestFormUpdateFood,
  IResponseFormFood,
  IResponseGetFoods,
} from 'src/model/foods.model';
import { IResponseFE } from 'src/model/web.model';
import { IMAGE_MULTER_CONFIG } from './config.multer';
import { Auth } from '../../../common/auth.decorator';

@Controller('/api')
export class FoodsController {
  constructor(private foodService: FoodsService) {}

  @Post('/create-food')
  @UseInterceptors(FileInterceptor('image', IMAGE_MULTER_CONFIG))
  async createFood(
    @Auth() user,
    @Body() request: IRequestFormFood,
    @UploadedFile() fileImage: Express.Multer.File,
  ): Promise<IResponseFE<IResponseFormFood>> {
    request.price = Number(request.price);
    const response = await this.foodService.createFood({
      userRestaurant: user.restaurant,
      fileImage,
      ...request,
    });
    return { data: response };
  }

  @Get('/restaurant-foods')
  async findFoodByRestaurant(
    @Auth() user,
  ): Promise<IResponseFE<IResponseGetFoods>> {
    const results = await this.foodService.findRestaurantFoods(user.restaurant);
    return { data: results };
  }

  @Put(`/update/:foodId`)
  @UseInterceptors(FileInterceptor('image', IMAGE_MULTER_CONFIG))
  async updateFoodById(
    @Auth() user,
    @Param('foodId', ParseIntPipe) foodId: number,
    @Body() request: IRequestFormUpdateFood,
    @UploadedFile() fileImage: Express.Multer.File,
  ): Promise<IResponseFE<IResponseFormFood>> {
    request.price = Number(request.price);
    const results = await this.foodService.editFood({
      foodId,
      fileImage,
      userRestaurant: user.restaurant,
      ...request,
    });
    return { data: results };
  }
  @Delete('/delete/:foodId')
  async deleteById(
    @Auth() user,
    @Param('foodId', ParseIntPipe) foodId: number,
  ): Promise<IResponseFE<IResponseFormFood>> {
    const results = await this.foodService.deleteFood(foodId, user.restaurant);
    return { data: results };
  }

  @Post('/foods')
  async getFoodLists(
    @Body() request: IReqFoodsLists,
  ): Promise<IResponseFE<IResponseGetFoods>> {
    const results = await this.foodService.getFoodlists(request);
    console.log(results);
    return { data: results };
  }

  @Get('/foods/:restaurantName')
  async getFoodDetail(
    @Param('restaurantName') restaurantName: string,
  ): Promise<IResponseFE<IResponseGetFoods>> {
    const addSpaceParam = restaurantName.replace(/-/g, ' ');
    const results = await this.foodService.getFoodListDetail(addSpaceParam);

    return { data: results };
  }

  @Patch('/add-recommendation/:foodId')
  async addRecommendation(
    @Auth() user,
    @Param('foodId', ParseIntPipe) foodId: number,
  ) {
    const response = await this.foodService.addRecommendationFoods(
      user.restaurant,
      foodId,
    );
    return response;
  }
}
