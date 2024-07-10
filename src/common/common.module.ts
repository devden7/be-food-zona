import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as winston from 'winston';

import { PrismaServices } from './prisma.service';
import { ValidationService } from './validation.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: 60,
      },
    }),
  ],
  providers: [PrismaServices, ValidationService],
  exports: [PrismaServices, ValidationService],
})
export class CommonModule {}
