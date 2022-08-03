import { UserRole } from 'src/users/user-role.enum';

export interface JwtPayload {
  id: number;
  role: UserRole;
}
