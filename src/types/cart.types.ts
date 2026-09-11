export const CartStatus = {
  Active: 1,
  Completed: 2,
  Abandoned: 3,
} as const;

export type CartStatus = typeof CartStatus[keyof typeof CartStatus];

export interface CartItemData {
  id: number;
  productId: number;
  productName?: string;
  price: number;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemData[];
  totalPrice: number;
  status: CartStatus;
}

export interface CartItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}