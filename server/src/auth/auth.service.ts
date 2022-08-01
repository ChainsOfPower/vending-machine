import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { UpdateUserCredentialsDto } from 'src/users/dto/update-user-credentials.dto';
import { HashingService } from 'src/users/hashing.service';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return await this.usersService.create(createUserDto);
  }

  async signIn(
    credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.getByUsername(credentials.username);

    if (
      user &&
      (await this.hashingService.verify(
        credentials.plainPassword,
        user.password,
      ))
    ) {
      const payload: JwtPayload = {
        username: user.username,
        role: user.role,
        id: user.id,
      };

      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Incorrect username or password');
  }

  async updateCredentials(
    loggedInUserId: number,
    credentials: UpdateUserCredentialsDto,
  ): Promise<ReadUserDto> {
    return await this.usersService.updateCredentials(
      loggedInUserId,
      credentials,
    );
  }

  async deleteUser(loggedInUserId: number): Promise<void> {
    return await this.usersService.delete(loggedInUserId);
  }
}
