import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [FoodsModule],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
