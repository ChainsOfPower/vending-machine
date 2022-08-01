import { IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { IsMultipleOf } from '../is-multiple-of.validator';

export class UpdateProductDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(0)
  amountAvailable: number;

  @IsNumber()
  @Min(0)
  @IsMultipleOf(5)
  cost: number;

  @IsString()
  @MaxLength(20)
  productName: string;
}
