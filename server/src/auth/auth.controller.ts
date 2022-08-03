import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { UpdateUserCredentialsDto } from 'src/users/dto/update-user-credentials.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: JwtPayload) {
    return this.usersService.getByUsername(user.username);
  }

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }

  @Patch('/credentials')
  @UseGuards(AuthGuard())
  updateCredentials(
    @Body() updateCredentialsDto: UpdateUserCredentialsDto,
    @GetUser() user: JwtPayload,
  ): Promise<ReadUserDto> {
    return this.authService.updateCredentials(user.id, updateCredentialsDto);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard())
  delete(@GetUser() user: JwtPayload) {
    return this.authService.deleteUser(user.id);
  }

  //TODO: Login entity and logout option
}
