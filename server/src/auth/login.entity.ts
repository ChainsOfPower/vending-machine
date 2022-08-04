import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';

/**
 * Login entity represents single user login session.
 * Refresh tokens are rotated on each refresh, invalidating all previously issued tokens.
 * With this, it is safer to store refresh tokens in local storage on client than it would be without token rotation.
 * More info can be found on following links:
 *
 * https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics-13#section-4.12
 * https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation
 */
@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  lastRefreshDate: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, (user) => user.logins)
  user: User;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.login)
  refreshTokens: RefreshToken[];
}
