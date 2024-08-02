import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { IReqOrder, IResOrder } from 'src/model/order.model';
import { Auth } from 'src/common/auth.decorator';
import { IResponseFE } from 'src/model/web.model';

@Controller('/api')
export class OrderContoller {
  constructor(private orderService: OrderService) {}

  @Post('/order')
  async createOrder(
    @Body() request: IReqOrder,
    @Auth() user,
  ): Promise<IResponseFE<IResOrder>> {
    const response = await this.orderService.createOrder({
      ...request,
      username: user.username,
    });
    return { data: response };
  }

  @Get('/orders-restaurant')
  async getOrdersRestaurant(@Auth() user) {
    const response = await this.orderService.getOrdersRestaurant(
      user.restaurant,
    );

    return response;
  }
}
