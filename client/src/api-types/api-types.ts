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
  role: UserRole;
};

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
};

export interface AuthCredentials {
  username?: string;
  plainPassword?: string;
};

export interface BuyProductResponse {
  totalMoneySpent: number;
  product: Product;
  change: Change;
};

export interface Change {
  coins: number[];
}

export interface ActiveSessions {
  activeSessionsCount: number;
};
