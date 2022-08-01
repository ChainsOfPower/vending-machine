import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  plainPassword: string;

  @IsEnum(UserRole)
  role: UserRole;
}
