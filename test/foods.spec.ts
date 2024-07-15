import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('FoodController Test', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('POST Create Foods : /api/create-food', () => {
    it('Should be succsess test when creating a food', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .send({
          foodName: 'ayam geprek pedas',
          description: 'ayam geprek pedas description',
          price: 20000,
          category: 'Junk food',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe('Data Berhasil ditambahkan');
      expect(response.body.data.food.name).toBe('ayam geprek pedas');
      expect(response.body.data.food.description).toBe(
        'ayam geprek pedas description',
      );
      expect(response.body.data.food.price).toBe(20000);
    });

    it('Should be an invalid test when creating a food (Foodname,Description,Category : Character less than 1, Price : number lower than 1000)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .send({
          foodName: '',
          description: '',
          price: 999,
          category: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
      expect(response.body.errors[3].path[0]).toBe('category');
    });

    it('Should be an invalid test when creating a food (Foodname,Category : Character more than 150,Description : Character more than 250, price : number greater than 1.000.000)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .send({
          foodName:
            'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name ',
          description:
            'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
          price: 1100000,
          category:
            'category name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name ',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
      expect(response.body.errors[3].path[0]).toBe('category');
    });
  });
});
