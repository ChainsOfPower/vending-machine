import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, QueryRunner } from 'typeorm';
import { BuyProductResponseDto } from './dto/buy-product-response.dto';
import { BuyProductDto } from './dto/buy-product.dto';
import { ChangeDto } from './dto/change.dto';
import { DepositDto } from './dto/deposit.dto';
import { Product } from './product.entity';

export const AVAILABLE_COINS_DESCENDING = [100, 50, 20, 10, 5];

@Injectable()
export class VendingMachineService {
  constructor(
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async deposit(buyerId: number, depositDto: DepositDto): Promise<ReadUserDto> {
    return await this.usersService.deposit(buyerId, depositDto.amount);
  }

  async reset(buyerId: number): Promise<ChangeDto> {
    const totalChange = await this.usersService.reset(buyerId);
    return this.toChangeDto(totalChange);
  }

  async buy(
    buyerId: number,
    buyProductDto: BuyProductDto,
  ): Promise<BuyProductResponseDto> {
    try {
      // eslint-disable-next-line no-var
      var queryRunner = await this.initTransaction();

      const product = await this.getAndValidateProduct(
        queryRunner,
        buyProductDto,
      );

      if (buyProductDto.amount > product.amountAvailable) {
        throw new BadRequestException('Unavailable product amount');
      }

      const user = await this.getAndValidateUser(queryRunner, buyerId);
      const totalCost = product.cost * buyProductDto.amount;

      if (totalCost > user.deposit) {
        throw new BadRequestException('Not enough money to make this purchase');
      }

      product.amountAvailable -= buyProductDto.amount;
      const changeDto = this.toChangeDto(user.deposit - totalCost);
      user.deposit = 0;

      await this.commitTransaction(queryRunner, user, product);

      return new BuyProductResponseDto(
        totalCost,
        {
          id: product.id,
          amountAvailable: product.amountAvailable,
          cost: product.cost,
          productName: product.productName,
        },
        changeDto,
      );
    } catch (err) {
      await queryRunner?.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner?.release();
    }
  }

  private async initTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  private async getAndValidateProduct(
    queryRunner: QueryRunner,
    buyProductDto: BuyProductDto,
  ) {
    const product = await queryRunner.manager
      .getRepository(Product)
      .findOneBy({ id: buyProductDto.productId });

    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private async getAndValidateUser(queryRunner: QueryRunner, buyerId: number) {
    const user = await queryRunner.manager
      .getRepository(User)
      .findOneBy({ id: buyerId });

    if (user == null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async commitTransaction(
    queryRunner: QueryRunner,
    user: User,
    product: Product,
  ) {
    await queryRunner.manager.save(user);
    await queryRunner.manager.save(product);

    await queryRunner.commitTransaction();
  }

  private toChangeDto(totalChange: number) {
    const change = [];
    AVAILABLE_COINS_DESCENDING.forEach((coin) => {
      while (totalChange >= coin) {
        change.push(coin);
        totalChange -= coin;
      }
    });

    return new ChangeDto(change);
  }
}
