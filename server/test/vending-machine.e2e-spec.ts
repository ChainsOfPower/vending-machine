import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, In } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { Product } from '../src/products/product.entity';
import { UserRole } from '../src/users/user-role.enum';
import { User } from '../src/users/user.entity';
import { initializeTestApp } from './helpers/initialize-test-app';

describe('VendingMachineController (e2e)', () => {
  let app: INestApplication;
  let buyerToken: { accessToken: string };
  let sellerToken: { accessToken: string };
  let buyerId: number;
  let sellerId: number;
  let cheapProductId: number;
  let expensiveProductId: number;
  const validDepositPayload = { amount: 5 };
  const invalidDepositPayload = { amount: 3 };
  const expensivePurchasePayload = () => ({
    productId: expensiveProductId,
    amount: 1,
  });
  const cheapPurchasePayload = () => ({ productId: cheapProductId, amount: 1 });

  beforeAll(async () => {
    app = await initializeTestApp();

    const authService = app.get<AuthService>(AuthService);
    const connection = await app.get(Connection);

    const buyer = new User();
    buyer.username = 'Vending buyer';
    buyer.password = 'Some invalid hash';
    buyer.role = UserRole.BUYER;
    buyer.deposit = 200;
    await connection.getRepository(User).save(buyer);
    console.log('OVO JE PERSISTED BUYER', buyer);
    buyerId = buyer.id;
    buyerToken = await authService.signToken({
      id: buyer.id,
      role: UserRole.BUYER,
    });

    const seller = new User();
    seller.username = 'Vending seller';
    seller.password = 'Some invalid hash';
    seller.role = UserRole.SELLER;
    seller.deposit = 0;
    await connection.getRepository(User).save(seller);
    sellerId = seller.id;
    sellerToken = await authService.signToken({
      id: seller.id,
      role: UserRole.SELLER,
    });

    const cheapProduct = new Product();
    cheapProduct.seller = seller;
    cheapProduct.cost = 10;
    cheapProduct.amountAvailable = 2;
    cheapProduct.productName = 'cheap product';
    await connection.getRepository(Product).save(cheapProduct);
    cheapProductId = cheapProduct.id;

    const expensiveProduct = new Product();
    expensiveProduct.amountAvailable = 2;
    expensiveProduct.seller = seller;
    expensiveProduct.cost = 2000;
    expensiveProduct.productName = 'expensive product';
    await connection.getRepository(Product).save(expensiveProduct);
    expensiveProductId = expensiveProduct.id;
  });

  it('Deposit without auth should fail', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/deposit')
      .send(validDepositPayload);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Seller should not be able to deposit', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/deposit')
      .auth(sellerToken.accessToken, { type: 'bearer' })
      .send(validDepositPayload);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('Buyer should not be able to deposit invalid coin', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/deposit')
      .auth(buyerToken.accessToken, { type: 'bearer' })
      .send(invalidDepositPayload);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Buyer should be able to deposit valid coin', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/deposit')
      .auth(buyerToken.accessToken, { type: 'bearer' })
      .send(validDepositPayload);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.deposit).toBe(205);
  });

  it('Buy without auth should fail', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/buy')
      .send(cheapPurchasePayload());

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Seller should not be able to buy', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/buy')
      .auth(sellerToken.accessToken, { type: 'bearer' })
      .send(cheapPurchasePayload());

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('Buyer should not be able to buy expensive product', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/buy')
      .auth(buyerToken.accessToken, { type: 'bearer' })
      .send(expensivePurchasePayload());

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Buyer should be able to buy cheap product', async () => {
    const response = await request(app.getHttpServer())
      .post('/vending-machine/buy')
      .auth(buyerToken.accessToken, { type: 'bearer' })
      .send(cheapPurchasePayload());

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  afterAll(async () => {
    const connection = await app.get(Connection);

    await connection
      .getRepository(Product)
      .delete({ id: In([cheapProductId, expensiveProductId]) });

    await connection
      .getRepository(User)
      .delete({ id: In([buyerId, sellerId]) });

    await app.close();
  });
});
