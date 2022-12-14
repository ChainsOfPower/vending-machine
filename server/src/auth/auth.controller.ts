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
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { UpdateUserCredentialsDto } from '../users/dto/update-user-credentials.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ActiveSessionsDto } from './dto/active-session.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('/profile')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: JwtPayload): Promise<ReadUserDto> {
    return this.usersService.getById(user.id);
  }

  @Get('/active-sessions')
  @UseGuards(AuthGuard())
  getActiveSessions(@GetUser() user: JwtPayload): Promise<ActiveSessionsDto> {
    return this.authService.getActiveSessions(user.id);
  }

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(authCredentials);
  }

  @Post('/refresh')
  refresh(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('/revoke')
  revoke(@Body() { refreshToken }: { refreshToken: string }): Promise<void> {
    return this.authService.revokeToken(refreshToken);
  }

  @Post('/revoke-all')
  @UseGuards(AuthGuard())
  revokeAll(@GetUser() user: JwtPayload): Promise<void> {
    return this.authService.revokeAllForUser(user.id);
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
}
