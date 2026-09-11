export const UserRole = {
  User: 1,
  Admin: 2,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const PaymentMethod = {
  CreditCard: 1,
  PayPal: 2,
  BankTransfer: 3,
  ApplePay: 4,
  GooglePay: 5,
  AmazonPay: 6,
  Cryptocurrency: 7,
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export interface UserResponse {
  id: number;
  userName: string;
  email: string;
  phone?: string;
  country?: string;
  avatarUrl?: string;
}

export interface UserCreateDto {
  userName: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  avatarUrl?: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  phone?: string;
  country?: string;
  avatarUrl?: string;
  contacts?: string;
  dob?: string;
  role?: number;
}