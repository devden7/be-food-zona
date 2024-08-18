import { diskStorage, memoryStorage } from 'multer';

export const IMAGE_MULTER_CONFIG = {
  storage: memoryStorage(),
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
