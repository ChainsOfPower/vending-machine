import { Injectable } from '@nestjs/common';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { UsersService } from 'src/users/users.service';
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

  //TODO: buy(productId: number, amount: number)
}
