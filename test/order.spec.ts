import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestModule } from './test.module';

describe('OrderController Test', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('POST Doing Order : /api/order', () => {
    it('Should be a success test when Doing an order', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe('Order berhasil');
    });

    it('Should be an invalid test when Doing an order (INVALID FoodId)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 149,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakartaa',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID description)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakartaa',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID price)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 10000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID restaurantName)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahuu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID image)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpegg',
              quantity: 1,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID quantity)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 2,
              totalPrice: 1000,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID totalQuantity)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
              totalPrice: 1000, //ini
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 10000,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });

    it('Should be an invalid test when Doing an order (INVALID calPriceItem)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 148,
              name: 'food jakarta',
              description: 'food jakarta',
              price: 1000,
              restaurantName: 'Restaurant tahu',
              image: '2024-07-29T01-17-15.866Z-testing-jpeg.jpeg',
              quantity: 1,
            },
            {
              foodId: 156,
              name: 'food jakarta 9',
              description: 'food jakarta 9',
              price: 9000,
              restaurantName: 'Restaurant tahu',
              image: null,
              quantity: 1,
            },
          ],
          totalQuantity: 2,
          calcPriceItem: 0,
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Order not valid!');
    });
  });

  describe('GET order lists restaurant : /api/orders-restaurant', () => {
    it('Should be a success test when get order lists restaurant', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders-restaurant')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
    });

    it('Should be a invalid test when get order lists restaurant (Token not valid)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/orders-restaurant',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH order delivery Food : /api/delivery-food/:orderId', () => {
    it('should be a success test when delivering the food to the restaurant', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/delivery-food/2')
        .set('Authorization', `${process.env.JWT_TOKEN_RESTAURANT_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Makanan berhasil dikirim!');
    });

    it('should be an invalid test when delivering the food to the restaurant (Not auth)', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/delivery-food/2',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });

    it('should be an invalid test when delivering the food to the restaurant (orderId Not found)', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/delivery-food/222')
        .set('Authorization', `${process.env.JWT_TOKEN_RESTAURANT_TESTING}`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Order not found!');
    });
  });

  describe('PATCH order delivery Food : /api/cancel-food/:orderId', () => {
    it('should be a success test when canceling the food to the restaurant', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/cancel-food/2')
        .set('Authorization', `${process.env.JWT_TOKEN_RESTAURANT_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Makanan Dibatalkan!');
    });

    it('should be an invalid test when canceling the food to the restaurant (Not auth)', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/cancel-food/2',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });

    it('should be an invalid test when canceling the food to the restaurant (orderId Not found)', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/cancel-food/222')
        .set('Authorization', `${process.env.JWT_TOKEN_RESTAURANT_TESTING}`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Order not found!');
    });
  });

  describe('GET order lists user : /api/orders-user', () => {
    it('Should be a success test when get order lists user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders-user')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
    });

    it('Should be a invalid test when get order lists user (Token not valid)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/orders-user',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });
  });
});
