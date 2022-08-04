import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { Product } from '../../src/products/product.entity';
import { TransformInterceptor } from '../../src/transform.interceptor';
import { User } from '../../src/users/user.entity';

export const initializeTestApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();

  return app;
};

export const cleanDb = async (app: INestApplication) => {
  const dbConnection = app.get(Connection);

  await dbConnection
    .createQueryBuilder()
    .delete()
    .from(Product)
    .where('id is not null')
    .execute();

  await dbConnection
    .createQueryBuilder()
    .delete()
    .from(User)
    .where('id is not null')
    .execute();
};
