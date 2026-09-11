export const OrderStatus = {
  Unknown: 0,
  Pending: 1,
  Confirmed: 2,
  Processing: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
  Returned: 7,
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  0: 'Unknown',
  1: 'Pending Payment',
  2: 'Confirmed',
  3: 'Processing',
  4: 'Shipped',
  5: 'Delivered',
  6: 'Cancelled',
  7: 'Returned',
};

export interface OrderItemData {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  items: OrderItemData[];
  totalPrice: number;
  status: OrderStatus;
}

export interface OrderCreateDto {
  userId: number;
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }[];
}