import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('OrderController Test', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST Doing Order : /api/order', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
    });

    it('Should be a success test when Doing an order', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/order')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`)
        .send({
          items: [
            {
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 20,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food22',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food22',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 22000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant22',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: '2',
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 12,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 10,
          calcPriceItem: 2000,
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
              foodId: 16,
              name: 'test food2',
              description: 'test description food2',
              price: 2000,
              restaurantName: 'restaurant2',
              image: null,
              quantity: 1,
              totalPrice: 2000,
            },
          ],
          totalQuantity: 1,
          calcPriceItem: 22000,
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
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
      await testService.createDummyOrder();
    });

    it('should be a success test when delivering the food to the restaurant', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/delivery-food/1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING_2}`);

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
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING_2}`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Order not found!');
    });
  });

  describe('PATCH order delivery Food : /api/cancel-food/:orderId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
      await testService.createDummyOrder();
    });
    it('should be a success test when canceling the food to the restaurant', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/cancel-food/1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING_2}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Makanan Dibatalkan!');
    });

    it('should be an invalid test when canceling the food to the restaurant (Not auth)', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/cancel-food/16',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });

    it('should be an invalid test when canceling the food to the restaurant (orderId Not found)', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/cancel-food/222')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING_2}`);
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Order not found!');
    });
  });

  describe('GET order lists user : /api/orders-user', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
      await testService.createDummyOrder();
    });
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

  describe('POST review food : /api/review/:orderId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
      await testService.createDummyOrder();
    });
    it('Should be a success test when the user gives a reviews', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 5,
          comment: 'ENAKKKKK',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe(
        'Your review has been submitted successfully',
      );
    });

    it('Should be an invalid test when the user gives a reviews (User try post review more than 1)', async () => {
      await testService.createDummyReview();
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 5,
          comment: 'ENAKKKKK',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('You can only review it once');
    });

    it('Should be an invalid test when the user gives a reviews (rating lower than 1)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 0,
          comment: 'ENAKKKKK',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('rating');
    });

    it('Should be an invalid test when the user gives a reviews (rating greater than 5)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 6,
          comment: 'ENAKKKKK',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('rating');
    });

    it('Should be an invalid test when the user gives a reviews (decimal number)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 4.5,
          comment: 'ENAKKKKK',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('rating');
    });

    it('Should be an invalid test when the user gives a reviews (comment not value)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 5,
          comment: '',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('comment');
    });

    it('Should be an invalid test when the user gives a reviews (Comment length more than 250 )', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/review/1')
        .send({
          rating: 5,
          comment:
            'GOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOODGOOD',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('comment');
    });
  });
});
