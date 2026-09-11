const WISHLIST_KEY = 'audiostore_wishlist';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
}

export function getWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function addToWishlist(item: WishlistItem): WishlistItem[] {
  const list = getWishlist();
  if (list.find(i => i.id === item.id)) return list;
  const updated = [...list, item];
  saveWishlist(updated);
  return updated;
}

export function removeFromWishlist(id: number): WishlistItem[] {
  const updated = getWishlist().filter(i => i.id !== id);
  saveWishlist(updated);
  return updated;
}

export function isInWishlist(id: number): boolean {
  return getWishlist().some(i => i.id === id);
}

export function clearWishlist(): void {
  localStorage.removeItem(WISHLIST_KEY);
}