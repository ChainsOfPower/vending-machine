import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => Product, (product) => product.seller)
  products: Product[];
}
