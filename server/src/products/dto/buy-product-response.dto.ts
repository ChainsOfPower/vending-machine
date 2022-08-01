import { ChangeDto } from './change.dto';
import { ReadProductDto } from './read-product.dto';

export class BuyProductResponseDto {
  constructor(
    totalMoneySpent: number,
    product: ReadProductDto,
    change: ChangeDto,
  ) {
    this.totalMoneySpent = totalMoneySpent;
    this.product = product;
    this.change = change;
  }

  totalMoneySpent: number;
  product: ReadProductDto;
  change: ChangeDto;
}
