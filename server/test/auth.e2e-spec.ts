import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, In } from 'typeorm';
import { UserRole } from '../src/users/user-role.enum';
import { User } from '../src/users/user.entity';
import { initializeTestApp } from './helpers/initialize-test-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const validUserPayload = {
    username: 'Test',
    plainPassword: 'Test1234',
    role: UserRole.BUYER,
  };

  const invalidUserPayload = {
    username: 'Test123',
    plainPassword: 'test',
    role: UserRole.BUYER,
  };

  beforeAll(async () => {
    app = await initializeTestApp();
  });

  it('should create user with strong password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(validUserPayload);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should reject weak password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(invalidUserPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    const connection = await app.get(Connection);
    await connection.getRepository(User).delete({
      username: In([validUserPayload.username, invalidUserPayload.username]),
    });
    await app.close();
  });
});
