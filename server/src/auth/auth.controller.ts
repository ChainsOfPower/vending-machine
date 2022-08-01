import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { AuthService } from './auth.service';
import { BuyerGuard } from './buyer.guard';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }
}
