import { Body, Controller, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  IRegisterRestaurant,
  IResponseRestaurant,
} from 'src/model/restaurant.model';
import { IResponseFE } from 'src/model/web.model';

@Controller('/api')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Post('/register-restaurant')
  async createRestaurant(
    @Body() request: IRegisterRestaurant,
  ): Promise<IResponseFE<IResponseRestaurant>> {
    const response = await this.restaurantService.registerRestaurant(request);
    return { data: response };
  }
}
