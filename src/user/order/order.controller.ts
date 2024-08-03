import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Patch('/delivery-food/:orderId')
  async deliveryFood(
    @Auth() user,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const response = await this.orderService.deliveryFood(
      orderId,
      user.restaurant,
    );
    return response;
  }

  @Patch('/cancel-food/:orderId')
  async cancelFood(
    @Auth() user,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const response = await this.orderService.cancelFood(
      orderId,
      user.restaurant,
    );
    return response;
  }
}
