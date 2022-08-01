import { UserRole } from 'src/users/user-role.enum';

export interface JwtPayload {
  username: string;
  role: UserRole;
}
