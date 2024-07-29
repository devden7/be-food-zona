import { Body, Controller, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  IRegisterRestaurant,
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
}
