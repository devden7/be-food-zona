import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [RestaurantModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
