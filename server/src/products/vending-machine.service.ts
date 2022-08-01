import { Injectable } from '@nestjs/common';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { UsersService } from 'src/users/users.service';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class VendingMachineService {
  constructor(private usersService: UsersService) {}

  async deposit(buyerId: number, depositDto: DepositDto): Promise<ReadUserDto> {
    return await this.usersService.deposit(buyerId, depositDto.amount);
  }
}
