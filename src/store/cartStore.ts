import type { CartItemData } from '../types/cart.types';

const CART_KEY = 'audiostore_cart';

export function getLocalCart(): CartItemData[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items: CartItemData[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToLocalCart(item: CartItemData): CartItemData[] {
  const cart = getLocalCart();
  const existing = cart.find(i => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
    existing.totalPrice = existing.unitPrice * existing.quantity;
  } else {
    cart.push({
      ...item,
      totalPrice: item.unitPrice * item.quantity,
    });
  }
  saveLocalCart(cart);
  return cart;
}

export function removeFromLocalCart(itemId: number): CartItemData[] {
  const cart = getLocalCart().filter(i => i.id !== itemId);
  saveLocalCart(cart);
  return cart;
}

export function updateLocalQuantity(itemId: number, quantity: number): CartItemData[] {
  const cart = getLocalCart().map(i =>
    i.id === itemId
      ? { ...i, quantity: Math.max(1, quantity), totalPrice: i.unitPrice * Math.max(1, quantity) }
      : i
  );
  saveLocalCart(cart);
  return cart;
}

export function clearLocalCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItemData[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}