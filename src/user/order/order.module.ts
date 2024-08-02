import { Module } from '@nestjs/common';
import { OrderContoller } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderContoller],
  providers: [OrderService],
})
export class OrderModule {}
