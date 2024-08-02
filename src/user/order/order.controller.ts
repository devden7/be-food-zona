import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { IReqOrder, IResOrder } from 'src/model/order.model';
import { response } from 'express';
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
}
