import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('RestaurantController Test', () => {
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

  describe('POST Create Restaurant : /api/create-restaurant', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
    });
    it('Should be success test when creating a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'restaurant1',
          city: 'jakarta',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test1');
      expect(response.body.data.restaurantName).toBe('restaurant1');
    });

    it('Should be an invalid test when creating a restaurant (User have a restaurant)', async () => {
      await testService.createDummyRestaurant();
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'restaurant1',
          city: 'jakarta',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('You can only have 1 restaurant');
    });

    it('Should be an invalid test when creating a restaurant (Restaurant: duplicate restaurant name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'restaurant2',
          city: 'jakarta',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Restaurant name already exists');
    });

    it('Should be an invalid test when creating a restaurant (Username : Character less than 3, City : Character less than 3)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'Re',
          city: 'Ja',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('restaurantName');
      expect(response.body.errors[1].path[0]).toBe('city');
    });

    it('Should be an invalid test when creating a restaurant (Username : Characters more than 50, City : Characters more than 50)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName:
            'Restaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprekRestaurant ayam geprek',
          city: 'JakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakartaJakarta',
        })
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('restaurantName');
      expect(response.body.errors[1].path[0]).toBe('city');
    });
  });

  describe('PATCH recommendation food restaurant : /api/add-recommendation/:foodId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
    });
    it('Should be success test when add recommendation foods restaurant', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/add-recommendation/15')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Successfully added food as a Recommendation',
      );
    });

    it('Should be invalid test when add recommendation foods restauran (Not Auth)', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/add-recommendation/149',
      );

      logger.info(response.body);
      expect(response.status).toBe(401);
    });

    it('Should be invalid test when add recommendation foods restaurant (foodId not found)', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/add-recommendation/149414141')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Food not found');
    });
  });
});
