import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as winston from 'winston';

import { PrismaServices } from './prisma.service';
import { ValidationService } from './validation.service';
import { ErrorFiler } from './error.filter';
import { AuthMiddleware } from './auth.middleware';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
        winston.format.colorize({ all: true }),
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
        expiresIn: '24h',
      },
    }),
  ],
  providers: [
    PrismaServices,
    ValidationService,
    CloudinaryService,
    { provide: 'APP_FILTER', useClass: ErrorFiler },
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        return cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      },
    },
  ],
  exports: [PrismaServices, ValidationService, CloudinaryService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
