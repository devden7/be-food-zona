import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('UserController Test', () => {
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

  describe('POST Create User : /api/register', () => {
    beforeEach(async () => {
      await testService.deleteDummyUser();
    });

    it('Should be success create user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'test1',
          name: 'test1',
          password: '123456',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test1');
      expect(response.body.data.name).toBe('test1');
    });

    it('Should be invalid when creating a user (Character less than 1)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: '',
          name: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be invalid when creating a user (Username : Character more than 20)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username:
            'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
          name: 'test1',
          password: '123456',
        });

      // logger.info(response.body)
      console.log(response.body.errors);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('username');
    });

    it('Should be invalid when creating a user (Username: Input form with spasing)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'test test',
          name: 'test1',
          password: '123456',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('username');
    });

    it('Should be invalid when creating a user (username: Duplicate username)', async () => {
      await testService.createDummyUser();

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'test1',
          name: 'test1',
          password: '123456',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBe('Username already exists');
    });

    it('Should be invalid when creating a user (Name: Character more than 50)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'test1',
          name: 'testtestesttesttesttesttesttesttesttesttesttesttesttstesttestesttesttesttesttesttesttesttesttesttesttestt',
          password: '123456',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('name');
    });

    it('Should be invalid when creating a user (Password: Character more than 20)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'test1',
          name: 'testtestesttesttesttesttesttesttesttesttesttesttesttstesttestesttesttesttesttesttesttesttesttesttesttestt',
          password: '123456',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors[0].path[0]).toBe('password');
    });
  });
});
