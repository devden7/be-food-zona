import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException, PrismaClientValidationError)
export class ErrorFiler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const errorsArr = exception.issues.map(({ path, message }) => ({
        path,
        message,
      }));
      response.status(400).json({
        errors: errorsArr,
      });
    } else {
      response.status(500).json({
        errors: 'Bad Request',
      });
    }
  }
}
