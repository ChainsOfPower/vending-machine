import { ChangeDto } from './change.dto';
import { ReadProductDto } from './read-product.dto';

export class BuyProductResponseDto {
  totalMoneySpent: number;
  product: ReadProductDto;
  change: ChangeDto;
}
