import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    await dataSource.synchronize(true); // reset db for each run
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (GET) - get paginated users', async () => {
    const res = await request(app.getHttpServer()).get('/user').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/users/:id (GET) - get specific user', async () => {
    const res = await request(app.getHttpServer()).get(`/user/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: createdUserId,
      name: 'Test User',
      email: 'test@example.com',
    });
  });
});
