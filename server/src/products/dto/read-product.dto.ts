export class ReadProductDto {
  constructor(
    public id: number,
    public amountAvailable: number,
    public cost: number,
    public productName: string,
  ) {}
}
