import { IsCoinAmount } from '../is-coin-amount.validator';

export class DepositDto {
  @IsCoinAmount()
  amount: number;
}
