import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaServices } from '../../common/prisma.service';
import { ValidationService } from '../../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  IResCityList,
  IRegisterRestaurant,
  IResponseRestaurant,
} from 'src/model/restaurant.model';
import { RestaurantValidation } from './restaurant.validation';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RestaurantService {
  constructor(
    private prismaService: PrismaServices,
    private validationService: ValidationService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async registerRestaurant(
    request: IRegisterRestaurant,
  ): Promise<IResponseRestaurant> {
    this.logger.info('Register restaurant : ' + JSON.stringify(request));
    const validateRequest = this.validationService.validate(
      RestaurantValidation.REGISTER_RESTAURANT,
      request,
    );

    const checkUserRestaurant = await this.prismaService.restaurant.findUnique({
      where: { username: request.user.username },
    });

    if (checkUserRestaurant) {
      throw new HttpException('You can only have 1 restaurant', 400);
    }

    const checkRestaurantName = await this.prismaService.restaurant.count({
      where: { restaurantName: validateRequest.restaurantName },
    });

    if (checkRestaurantName !== 0) {
      throw new HttpException('Restaurant name already exists', 400);
    }

    const insertDataCity = await this.prismaService.city.upsert({
      where: { city_name: validateRequest.city.toLowerCase() },
      update: {},
      create: { city_name: validateRequest.city.toLowerCase() },
      include: {
        restaurant: true,
      },
    });

    const insertDataRestaurant = await this.prismaService.restaurant.create({
      data: {
        restaurantName: validateRequest.restaurantName,
        username: request.user.username,
        city_name: insertDataCity.city_name,
      },
      include: {
        user: true,
        city: true,
      },
    });

    request.user.restaurant = insertDataRestaurant.restaurantName;

    return {
      username: insertDataRestaurant.username,
      name: insertDataRestaurant.user.name,
      restaurantName: insertDataRestaurant.restaurantName,
      token: await this.jwtService.signAsync({
        name: insertDataRestaurant.user.name,
        username: insertDataRestaurant.username,
        restaurant: insertDataRestaurant.restaurantName,
      }),
    };
  }

  async getAllCity(): Promise<IResCityList[]> {
    const findCityQuery = await this.prismaService.city.findMany();
    return findCityQuery;
  }
}
