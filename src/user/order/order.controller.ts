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
import {
  IOrderLists,
  IReqOrder,
  IReqReviewForm,
  IResOrder,
} from 'src/model/order.model';
import { Auth } from '../../common/auth.decorator';
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
  async getOrdersRestaurant(
    @Auth() user,
  ): Promise<IResponseFE<IOrderLists[] | []>> {
    const response = await this.orderService.getOrdersRestaurant(
      user.restaurant,
    );

    return { data: response };
  }

  @Patch('/delivery-food/:orderId')
  async deliveryFood(
    @Auth() user,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<IResponseFE<IResOrder>> {
    const response = await this.orderService.deliveryFood(
      orderId,
      user.restaurant,
    );
    return { data: response };
  }

  @Patch('/cancel-food/:orderId')
  async cancelFood(
    @Auth() user,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<IResponseFE<IResOrder>> {
    const response = await this.orderService.cancelFood(
      orderId,
      user.restaurant,
    );
    return { data: response };
  }

  @Get('/orders-user')
  async getOrdersUser(@Auth() user): Promise<IResponseFE<IOrderLists[] | []>> {
    const response = await this.orderService.getOrdersUser(user.username);

    return { data: response };
  }

  @Post('/review/:orderId')
  async createReview(
    @Body() request: IReqReviewForm,
    @Auth() user,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<IResponseFE<IResOrder>> {
    const response = await this.orderService.createReview(
      request,
      user.username,
      orderId,
    );
    return { data: response };
  }
}
