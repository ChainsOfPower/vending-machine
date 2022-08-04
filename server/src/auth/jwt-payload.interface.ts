import { UserRole } from '../users/user-role.enum';

export interface JwtPayload {
  id: number;
  role: UserRole;
}
