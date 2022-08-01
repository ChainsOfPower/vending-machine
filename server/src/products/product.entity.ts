import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.products)
  seller: User;
}
