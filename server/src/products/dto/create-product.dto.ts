import { IsInt, IsString, MaxLength, Min } from 'class-validator';
import { IsMultipleOf } from '../is-multiple-of.validator';

export class CreateProductDto {
  @IsInt()
  @Min(0)
  amountAvailable: number;

  @IsInt()
  @Min(0)
  @IsMultipleOf(5)
  cost: number;

  @IsString()
  @MaxLength(20)
  productName: string;
}
