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
    const user = await this.usersRepository.findOneBy({ username });

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

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      deposit: user.deposit,
      role: user.role,
    };
  }

  async updateCredentials(
    userId: number,
    updateUserDto: UpdateUserCredentialsDto,
  ): Promise<ReadUserDto> {
    await this.validateUsernameNotExists(userId, updateUserDto.username);

    const userToUpdate = await this.getEntityById(userId);

    userToUpdate.username = updateUserDto.username;
    userToUpdate.password = await this.hashingService.hash(
      updateUserDto.plainPassword,
    );

    await this.usersRepository.save(userToUpdate);

    return {
      id: userToUpdate.id,
      deposit: userToUpdate.deposit,
      password: userToUpdate.password,
      role: userToUpdate.role,
      username: userToUpdate.username,
    };
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

  private async getEntityById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user == null) {
      throw new NotFoundException();
    }

    return user;
  }
}
