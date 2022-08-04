import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unsigned: true })
  deposit: number;

  @Column({ nullable: false })
  role: UserRole;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @VersionColumn()
  version: number;
}
