import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as path from 'path';

describe('FoodController Test', () => {
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

  describe('POST Create Foods : /api/create-food', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
    });

    it('Should be success test when creating a food with image (FORMAT FILE : PNG)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');

      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field('foodName', 'test food1')
        .field('description', 'test description food1')
        .field('price', 1000)
        .field('category', 'category1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe('Data Berhasil ditambahkan');
      expect(response.body.data.foods.name).toBe('test food1');
      expect(response.body.data.foods.description).toBe(
        'test description food1',
      );
      expect(response.body.data.foods.price).toBe(1000);
      expect(response.body.data.foods.image).toBeDefined();
    });

    it('Should be success test when creating a food with image (FORMAT FILE : JPG)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-jpg.jpg');

      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field('foodName', 'test food1')
        .field('description', 'test description food1')
        .field('price', 1000)
        .field('category', 'category1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe('Data Berhasil ditambahkan');
      expect(response.body.data.foods.name).toBe('test food1');
      expect(response.body.data.foods.description).toBe(
        'test description food1',
      );
      expect(response.body.data.foods.price).toBe(1000);
      expect(response.body.data.foods.image).toBeDefined();
    });

    it('Should be success test when creating a food with image (FORMAT FILE : JPEG)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-jpeg.jpeg');

      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field('foodName', 'test food1')
        .field('description', 'test description food1')
        .field('price', 1000)
        .field('category', 'category1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.message).toBe('Data Berhasil ditambahkan');
      expect(response.body.data.foods.name).toBe('test food1');
      expect(response.body.data.foods.description).toBe(
        'test description food1',
      );
      expect(response.body.data.foods.price).toBe(1000);
      expect(response.body.data.foods.image).toBeDefined();
    });

    it('Should be invalid test when creating a food without image', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', '')
        .field('foodName', 'ayam geprek pedas')
        .field('description', 'ayam geprek pedas description')
        .field('price', 20000)
        .field('category', 'Junk food')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe(
        'Only .jpg, .jpeg, and .png  formats are supported.',
      );
    });

    it('Should be invalid test when creating a food with image (FORMAT FILE : SVG)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-svg.svg');

      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field('foodName', 'test food1')
        .field('description', 'test description food1')
        .field('price', 1000)
        .field('category', 'category1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe(
        'Only .jpg, .jpeg, and .png  formats are supported.',
      );
    });

    it('Should be an invalid test when creating a food (Foodname,Description,Category : Character less than 1, Price : number lower than 1000)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field('foodName', '')
        .field('description', '')
        .field('price', 999)
        .field('category', '')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
      expect(response.body.errors[3].path[0]).toBe('category');
    });

    it('Should be an invalid test when creating a food (Foodname,Category : Character more than 150,Description : Character more than 250, price : number greater than 1.000.000)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');

      const response = await request(app.getHttpServer())
        .post('/api/create-food')
        .attach('image', pickImage)
        .field(
          'foodName',
          'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
        )
        .field(
          'description',
          'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
        )
        .field('price', 1100000)
        .field(
          'category',
          'category name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
        )
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
      expect(response.body.errors[3].path[0]).toBe('category');
    });
  });

  describe('GET Foods lists : /api/restaurant-foods', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
    });
    it('Should be success test when get a food', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/restaurant-foods')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);
      logger.info(response.body);
      expect(response.status).toBe(200);
    });
  });

  describe('UPDATE Foods : /api/update/:foodId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createDummyUser();
      await testService.createDummyRestaurant();
      await testService.createDummyFood();
    });

    it('Should be success test when updating a food', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .put('/api/update/15')
        .attach('image', pickImage)
        .field('foodName', 'test food1 updated')
        .field('description', 'test description food1 updated')
        .field('price', 1001)
        .field('category', 'category1-1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.foods.name).toBe('test food1 updated');
      expect(response.body.data.foods.description).toBe(
        'test description food1 updated',
      );
      expect(response.body.data.foods.price).toBe(1001);
    });

    it('Should be invalid test when updating a food (ParamsId not found)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .put('/api/update/8')
        .attach('image', pickImage)
        .field('foodName', 'test food1 updated')
        .field('description', 'test description food1 updated')
        .field('price', 1001)
        .field('category', 'category1-1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Food not found');
    });

    it('Should be invalid test when updating a food (Restaurant Name not valid)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .put('/api/update/8')
        .attach('image', pickImage)
        .field('foodName', 'test food1 updated')
        .field('description', 'test description food1 updated')
        .field('price', 1001)
        .field('category', 'category1-1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Food not found');
    });

    it('Should be an invalid test when updateting a food (Foodname,Description, : Character less than 1, Price : number lower than 1000)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .put('/api/update/15')
        .attach('image', pickImage)
        .field('foodName', '')
        .field('description', '')
        .field('price', 999)
        .field('category', '')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
    });

    it('Should be an invalid test when updating a food (Foodname : Character more than 150,Description : Character more than 250, price : number greater than 1.000.000)', async () => {
      const filePath = path.resolve(__dirname, '..', 'upload');
      const pickImage = path.resolve(filePath, 'testing-png.png');
      const response = await request(app.getHttpServer())
        .put('/api/update/15')
        .attach('image', pickImage)
        .field(
          'foodName',
          'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
        )
        .field(
          'description',
          'food name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name name',
        )
        .field('price', 1100000)
        .field('category', 'category1-1')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('foodName');
      expect(response.body.errors[1].path[0]).toBe('description');
      expect(response.body.errors[2].path[0]).toBe('price');
    });
  });

  describe('DELETE Foods : /delete/:foodId', () => {
    it('Should be success test when deleting a food', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/delete/15')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Data Berhasil dihapus');
      expect(response.body.data.foods.name).toBe('test food1');
      expect(response.body.data.foods.description).toBe(
        'test description food1',
      );
      expect(response.body.data.foods.price).toBe(1000);
    });

    it('Should be invalid test when deleting a food (Params id : Not found)', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/delete/8')
        .set('Authorization', `${process.env.JWT_TOKEN_TESTING}`);
      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe('Food not found');
    });
  });

  describe('POST (for geting lists all foods) Foods Lists : /api/foods', () => {
    it('Should be success test when POST foods Lists with ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/foods')
        .send({
          city: 'jakarta',
          category: 'near_me',
        });
      logger.info(response.body);
    });
  });
});
