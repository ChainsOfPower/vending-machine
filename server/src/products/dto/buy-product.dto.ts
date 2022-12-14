import { IsInt, Min } from 'class-validator';

export class BuyProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  amount: number;
}
