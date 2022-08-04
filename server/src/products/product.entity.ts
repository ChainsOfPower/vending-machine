import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unsigned: true })
  amountAvailable: number;

  @Column({ nullable: false })
  cost: number;

  @Column({ nullable: false })
  productName: string;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @VersionColumn()
  version: number;
}
