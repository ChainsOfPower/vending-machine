export interface Product {
  id: number;
  productName: string;
  amountAvailable: number;
  cost: number;
};

export interface User {
  id: number;
  username: string;
  deposit: number;
};

export interface BuyProductResponse {
  totalMoneySpent: number;
  product: Product;
  change: Change;
};

export interface Change {
  coins: number[];
}

