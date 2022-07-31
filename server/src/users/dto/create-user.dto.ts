import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  id: number;
  username: string;
  password: string;
  deposit: number;
  role: UserRole;
}
