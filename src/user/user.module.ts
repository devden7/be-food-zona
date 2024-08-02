import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [RestaurantModule, OrderModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
