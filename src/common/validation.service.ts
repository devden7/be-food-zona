import { HttpException, Injectable } from '@nestjs/common';
import { IReqOrderValidation } from 'src/model/order.model';
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

  validationOrder(request: IReqOrderValidation): IReqOrderValidation {
    let totalQuantity = 0;
    let calcPriceItem = 0;
    const PAJAK = 11000;
    const { items, itemsBody, idArr } = request;
    const validId = items.map((item) => item.foodId);

    const idNotFound = idArr.filter((id) => !validId.includes(id));

    if (idNotFound.length > 0) {
      throw new HttpException('Order not valid!', 400);
    }

    for (let j = 0; j < items.length; j++) {
      if (
        items[j].foodId !== itemsBody[j].foodId ||
        items[j].name !== itemsBody[j].name ||
        items[j].description !== itemsBody[j].description ||
        items[j].price !== itemsBody[j].price ||
        items[j].restaurantName !== itemsBody[j].restaurantName ||
        items[j].public_id_img !== itemsBody[j].public_id_img ||
        items[j].version_img !== itemsBody[j].version_img ||
        items[j].format_img !== itemsBody[j].format_img
      ) {
        throw new HttpException('Order not valid!', 400);
      } else {
        totalQuantity = totalQuantity + itemsBody[j].quantity;
        calcPriceItem =
          calcPriceItem + itemsBody[j].price * itemsBody[j].quantity;
      }
    }

    if (
      totalQuantity !== request.totalQuantityBody ||
      calcPriceItem + PAJAK !== request.calcPriceItemBody + PAJAK
    ) {
      throw new HttpException('Order not valid!', 400);
    }

    const totalPrice = calcPriceItem + PAJAK;
    return { items, calcPriceItem: totalPrice, totalQuantity };
  }
}
