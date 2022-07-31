import { UserRole } from '../user-role.enum';

export class ReadUserDto {
  id: number;
  username: string;
  deposit: number;
  role: UserRole;
}
