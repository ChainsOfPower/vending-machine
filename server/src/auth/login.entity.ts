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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.login, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];
}
