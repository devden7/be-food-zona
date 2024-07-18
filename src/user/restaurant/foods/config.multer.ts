import { HttpException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const IMAGE_MULTER_CONFIG = {
  storage: diskStorage({
    destination(req, file, callback) {
      callback(null, './images');
    },
    filename(req, file, callback) {
      const fileName =
        new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
