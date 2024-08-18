import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../model/cloudinary.model';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const fileName = file.originalname.split('.').slice(0, -1).join('.');
      const formatImage = file.originalname.split('.').slice(-1).join('.');
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id:
            new Date().toISOString().replace(/:/g, '-') + '-' + fileName,
          folder: 'foods',
          format: formatImage,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
