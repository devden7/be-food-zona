import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { PrismaServices } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { IRegisterUser, IReponseUser } from 'src/model/user.model';
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

    return results;
  }
}
