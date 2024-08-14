import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  IRegisterRestaurant,
  IResCityList,
  IResponseRestaurant,
} from 'src/model/restaurant.model';
import { IResponseFE } from 'src/model/web.model';
import { Auth } from '../../common/auth.decorator';

@Controller('/api')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Post('/register-restaurant')
  async createRestaurant(
    @Auth() user,
    @Body() request: IRegisterRestaurant,
  ): Promise<IResponseFE<IResponseRestaurant>> {
    const response = await this.restaurantService.registerRestaurant({
      user,
      ...request,
    });
    return { data: response };
  }

  @Get('/city')
  async getCityList(): Promise<IResponseFE<IResCityList[]>> {
    const response = await this.restaurantService.getAllCity();
    return { data: response };
  }
}
