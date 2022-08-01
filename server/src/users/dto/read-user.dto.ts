import { Exclude } from 'class-transformer';
import { UserRole } from '../user-role.enum';

export class ReadUserDto {
  id: number;
  username: string;
  @Exclude({ toPlainOnly: true })
  password: string;
  deposit: number;
  role: UserRole;
}
