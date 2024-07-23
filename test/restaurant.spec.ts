import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestModule } from './test.module';

describe('RestaurantController Test', () => {
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

  describe('POST Create Restaurant : /api/create-restaurant', () => {
    it('Should be success test when creating a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'Restaurant ayam geprek',
          city: 'Jakarta',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test1');
      expect(response.body.data.restaurantName).toBe('Restaurant ayam geprek');
    });

    it('Should be an invalid test when creating a restaurant (User have a restaurant)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'Restaurant ayam geprekk',
          city: 'Jakarta',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('You can only have 1 restaurant');
    });

    it('Should be an invalid test when creating a restaurant (Restaurant: duplicate restaurant name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register-restaurant')
        .send({
          restaurantName: 'Restaurant ayam geprek',
          city: 'Jakarta',
        });

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
        });

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
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('restaurantName');
      expect(response.body.errors[1].path[0]).toBe('city');
    });
  });
});
