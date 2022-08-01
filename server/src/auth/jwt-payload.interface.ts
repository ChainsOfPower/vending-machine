import { UserRole } from 'src/users/user-role.enum';

export interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
}
