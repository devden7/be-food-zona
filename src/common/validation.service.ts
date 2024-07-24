import { HttpException, Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType, data: T): T {
    return zodType.parse(data);
  }

  fileFilter(file, imgBody: string) {
    if (imgBody === '') {
      return null;
    }

    if (file === undefined) {
      throw new HttpException(
        'Only .jpg, .jpeg, and .png  formats are supported.',
        400,
      );
    }

    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      return file.filename;
    }
  }
}
