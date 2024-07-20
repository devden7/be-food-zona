import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { PrismaServices } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  IRegisterUser,
  IReponseUser,
  IRequestLoginUser,
} from '../model/user.model';
import { UserValidation } from './user.validation';

Injectable();
export class UserService {
  constructor(
    private prismaService: PrismaServices,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async registerUser(request: IRegisterUser): Promise<IReponseUser> {
    this.logger.info('Register User : ' + JSON.stringify(request));

    const validateRequest = this.validationService.validate(
      UserValidation.REGISTER_USER,
      request,
    );

    const checkUsername = await this.prismaService.user.count({
      where: {
        username: validateRequest.username,
      },
    });

    if (checkUsername !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    validateRequest.password = await bcrypt.hash(validateRequest.password, 1);

    const results = await this.prismaService.user.create({
      data: validateRequest,
    });

    return { username: results.username, name: results.name };
  }

  async loginUser(request: IRequestLoginUser): Promise<IReponseUser> {
    this.logger.info('Login User ' + JSON.stringify(request));

    const validateRequest = await this.validationService.validate(
      UserValidation.LOGIN_USER,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: validateRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const password = await bcrypt.compare(
      validateRequest.password,
      user.password,
    );

    if (!password) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const findRestaurant = await this.prismaService.restaurant.findUnique({
      where: { username: user.username },
    });

    return {
      name: user.name,
      username: user.name,
      restaurant:
        findRestaurant !== null ? findRestaurant.restaurantName : null,
    };
  }
}
