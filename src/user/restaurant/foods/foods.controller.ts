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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FoodsService } from './foods.service';
import {
  IRequestFormFood,
  IRequestFormUpdateFood,
  IResponseFormFood,
  IResponseGetFoods,
} from 'src/model/foods.model';
import { IResponseFE } from 'src/model/web.model';
import { IMAGE_MULTER_CONFIG } from './config.multer';
import { Auth } from 'src/common/auth.decorator';

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
