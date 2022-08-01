import { Exclude } from 'class-transformer';
import { UserRole } from '../user-role.enum';

export class ReadUserDto {
  constructor(
    id: number,
    username: string,
    password: string,
    deposit: number,
    role: UserRole,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.deposit = deposit;
    this.role = role;
  }

  id: number;
  username: string;
  deposit: number;
  role: UserRole;

  @Exclude()
  password: string;
}
