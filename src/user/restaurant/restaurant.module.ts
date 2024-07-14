import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
