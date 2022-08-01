import { Injectable } from '@nestjs/common';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { UsersService } from 'src/users/users.service';
import { BuyProductDto } from './dto/buy-product.dto';
import { ChangeDto } from './dto/change.dto';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class VendingMachineService {
  //TODO: extract to const export
  readonly AVAILABLE_COINS_DESCENDING = [100, 50, 20, 10, 5];

  constructor(private usersService: UsersService) {}

  async deposit(buyerId: number, depositDto: DepositDto): Promise<ReadUserDto> {
    return await this.usersService.deposit(buyerId, depositDto.amount);
  }

  async reset(buyerId: number): Promise<ChangeDto> {
    let totalChange = await this.usersService.reset(buyerId);

    const change = [];
    this.AVAILABLE_COINS_DESCENDING.forEach((coin) => {
      while (totalChange >= coin) {
        change.push(coin);
        totalChange -= coin;
      }
    });

    return new ChangeDto(change);
  }

  async buy(buyerId: number, buyProductDto: BuyProductDto) {
    //transaction steps:
    //1. get product and calculate total
    //2. get user and check if user has enough money, if not rollback and throw bad request
    //3. update product to reduce available product count -> if not enough products, throw bad request
    //4. reset user deposit and calculate and return change
    return null;
  }

  //TODO: buy(productId: number, amount: number)
}
