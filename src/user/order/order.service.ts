import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaServices } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  IReqOrder,
  IReqOrderValidation,
  IResOrder,
} from 'src/model/order.model';
import { Logger } from 'winston';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaServices,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  async createOrder(request: IReqOrder): Promise<IResOrder> {
    this.logger.info('Order : ', JSON.stringify(request));
    const { items } = request;
    const idItems = [];

    for (let i = 0; i < items.length; i++) {
      idItems.push(items[i].foodId);
    }

    const findProductQuery = await this.prismaService.food.findMany({
      where: { foodId: { in: idItems } },
    });

    const requestValidation: IReqOrderValidation = {
      items: findProductQuery,
      itemsBody: items,
      idArr: idItems,
      totalQuantityBody: request.totalQuantity,
      calcPriceItemBody: request.calcPriceItem,
    };
    const validationRequest =
      this.validationService.validationOrder(requestValidation);

    const dataForInsert = [];

    for (let k = 0; k < validationRequest.items.length; k++) {
      dataForInsert.push({
        totalPrice: validationRequest.calcPriceItem,
        status: 'pending',
      });
    }

    const insertOrderQuery = await this.prismaService.order.create({
      data: {
        totalPrice: validationRequest.calcPriceItem,
        totalQuantity: validationRequest.totalQuantity,
        status: 'Pending',
        restaurantName: validationRequest.items[0].restaurantName,
        username: request.username,
      },
    });

    const orderItemList = [];
    for (let l = 0; l < validationRequest.items.length; l++) {
      orderItemList.push({
        foodId: validationRequest.items[l].foodId,
        orderId: insertOrderQuery.orderId,
        foodNameOrder: validationRequest.items[l].name,
      });
    }

    await this.prismaService.orderItem.createMany({
      data: orderItemList,
    });

    return { message: 'Order berhasil' };
  }

  async getOrdersRestaurant(restaurantName: string) {
    const findOrdersQuery = await this.prismaService.order.findMany({
      where: {
        restaurantName: restaurantName,
      },
      select: {
        orderId: true,
        restaurantName: true,
        orderItem: {
          select: {
            orderItemId: true,
            foodNameOrder: true,
          },
        },
        totalPrice: true,
        status: true,
        username: true,
        totalQuantity: true,
        restaurant: {
          select: {
            city_name: true,
          },
        },
      },
    });

    const result = findOrdersQuery.length > 0 ? findOrdersQuery : [];
    return result;
  }

  async deliveryFood(orderId: number, restaurantName: string) {
    const findIdOrderRestaurantQuery =
      await this.prismaService.order.findUnique({
        where: {
          orderId: orderId,
          restaurantName: restaurantName,
        },
      });

    if (!findIdOrderRestaurantQuery) {
      throw new HttpException('Order not found!', 404);
    }

    await this.prismaService.order.findUnique({
      where: { restaurantName: restaurantName, orderId: orderId },
    });

    await this.prismaService.order.update({
      where: {
        orderId: orderId,
      },
      data: {
        status: 'Berhasil',
      },
    });

    return { message: 'Makanan berhasil dikirim!' };
  }

  async cancelFood(orderId: number, restaurantName: string) {
    const findIdOrderRestaurantQuery =
      await this.prismaService.order.findUnique({
        where: {
          orderId: orderId,
          restaurantName: restaurantName,
        },
      });

    if (!findIdOrderRestaurantQuery) {
      throw new HttpException('Order not found!', 404);
    }

    await this.prismaService.order.findUnique({
      where: { restaurantName: restaurantName, orderId: orderId },
    });

    await this.prismaService.order.update({
      where: {
        orderId: orderId,
      },
      data: {
        status: 'Dibatalkan',
      },
    });

    return { message: 'Makanan Dibatalkan!' };
  }

  async getOrdersUser(username: string) {
    const findOrdersQuery = await this.prismaService.order.findMany({
      where: {
        username: username,
      },
      select: {
        orderId: true,
        restaurantName: true,
        orderItem: {
          select: {
            orderItemId: true,
            foodNameOrder: true,
          },
        },
        totalPrice: true,
        status: true,
        username: true,
        totalQuantity: true,
        restaurant: {
          select: {
            city_name: true,
          },
        },
      },
    });

    const result = findOrdersQuery.length > 0 ? findOrdersQuery : [];
    return result;
  }
}
