import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserCredentialsDto } from './dto/update-user-credentials.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from './hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private hashingService: HashingService,
  ) {}

  async getById(id: number): Promise<ReadUserDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user == null) {
      return null;
    }

    return this.toReadDto(user);
  }

  async getByUsername(username: string): Promise<ReadUserDto> {
    const user = await this.usersRepository.findOneBy({ username });

    if (user == null) {
      return null;
    }

    return this.toReadDto(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.validateAndGetEntity(id);
    await this.usersRepository.remove(user);
  }

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    await this.validateUsernameNotExists(null, createUserDto.username);
    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.hashingService.hash(createUserDto.plainPassword);
    user.deposit = 0;
    user.role = createUserDto.role;
    await this.usersRepository.save(user);

    return this.toReadDto(user);
  }

  async updateCredentials(
    userId: number,
    updateUserDto: UpdateUserCredentialsDto,
  ): Promise<ReadUserDto> {
    await this.validateUsernameNotExists(userId, updateUserDto.username);

    const userToUpdate = await this.validateAndGetEntity(userId);

    userToUpdate.username = updateUserDto.username;
    userToUpdate.password = await this.hashingService.hash(
      updateUserDto.plainPassword,
    );

    await this.usersRepository.save(userToUpdate);

    return this.toReadDto(userToUpdate);
  }

  async deposit(userId: number, amount: number): Promise<ReadUserDto> {
    const user = await this.validateAndGetEntity(userId);
    user.deposit += amount;
    this.usersRepository.save(user);

    return this.toReadDto(user);
  }

  async reset(userId: number): Promise<number> {
    const user = await this.validateAndGetEntity(userId);
    const resetAmount = user.deposit;
    user.deposit = 0;
    await this.usersRepository.save(user);
    return resetAmount;
  }

  private async validateUsernameNotExists(
    updatingUserId: number,
    username: string,
  ) {
    const isUsernameTaken =
      (await this.usersRepository
        .createQueryBuilder('user')
        .andWhere('((cast(:id as int) IS NULL) OR user.id != :id)', {
          id: updatingUserId,
        })
        .andWhere('user.username = :username', { username })
        .getCount()) > 0;

    if (isUsernameTaken) {
      throw new BadRequestException('Username is already taken');
    }
  }

  private async validateAndGetEntity(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user == null) {
      throw new NotFoundException();
    }

    return user;
  }

  private toReadDto(user: User): ReadUserDto {
    return new ReadUserDto(
      user.id,
      user.username,
      user.password,
      user.deposit,
      user.role,
    );
  }
}
