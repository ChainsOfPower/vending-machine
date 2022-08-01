import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from './hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepositort: Repository<User>,
    private hashingService: HashingService,
  ) {}

  async getById(id: number): Promise<ReadUserDto> {
    const user = await this.getEntityById(id);

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      deposit: user.deposit,
      role: user.role,
    };
  }

  async getByUsername(username: string): Promise<ReadUserDto> {
    const user = await this.usersRepositort.findOneBy({ username });

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      deposit: user.deposit,
      role: user.role,
    };
  }

  async delete(id: number): Promise<void> {
    const user = await this.getEntityById(id);
    await this.usersRepositort.remove(user);
  }

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    await this.validateUsernameNotExists(null, createUserDto.username);
    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.hashingService.hash(createUserDto.plainPassword);
    user.deposit = 0;
    user.role = createUserDto.role;
    await this.usersRepositort.save(user);

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      deposit: user.deposit,
      role: user.role,
    };
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.validateUsernameNotExists(userId, updateUserDto.username);

    const userToUpdate = await this.getEntityById(userId);

    userToUpdate.password = await this.hashingService.hash(
      updateUserDto.plainPassword,
    );

    await this.usersRepositort.save(userToUpdate);

    return updateUserDto;
  }

  private async validateUsernameNotExists(
    updatingUserId: number,
    username: string,
  ) {
    const isUsernameTaken =
      (await this.usersRepositort
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

  private async getEntityById(id: number): Promise<User> {
    const user = await this.usersRepositort.findOneBy({ id });

    if (user == null) {
      throw new NotFoundException();
    }

    return user;
  }
}
