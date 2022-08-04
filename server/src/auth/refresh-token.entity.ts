import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Login } from './login.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  validUntil: Date;

  @Column({ nullable: false })
  isActive: boolean;

  @ManyToOne(() => Login, (login) => login.refreshTokens, {
    eager: true,
    cascade: ['update'],
    onDelete: 'CASCADE',
  })
  login: Login;
}
