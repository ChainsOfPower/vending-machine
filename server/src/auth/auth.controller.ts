import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';

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
