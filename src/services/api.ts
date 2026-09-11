import type { Product, ProductCreateDto } from '../types/product.types';
import type { CartResponse, CartItemDto } from '../types/cart.types';
import type { OrderResponse, OrderCreateDto } from '../types/order.types';
import type { UserResponse, UserCreateDto } from '../types/user.types';
import type { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';
import { getToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7184/api';

// ─── HTTP клиент ───
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── МОКИ ───
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Beats Solo 4 – Jennie Edition',
    price: 4299, category: 'Headphones',
    description: 'Limited edition collaboration with JENNIE from BLACKPINK.',
    images: [{ id: 1, url: '/images/beats.jennie.jpg', productId: 1 }],
  },
  {
    id: 2, name: 'Bose QuietComfort 45',
    price: 2999, category: 'Headphones',
    description: 'Industry-leading noise cancellation.',
    images: [{ id: 2, url: '/images/bose.jpg', productId: 2 }],
  },
  {
    id: 3, name: 'Sony WH-1000XM5',
    price: 3799, category: 'Headphones',
    description: 'Best-in-class sound quality.',
    images: [{ id: 3, url: '/images/sony.jpg', productId: 3 }],
  },
  {
    id: 4, name: 'Apple AirPods Max',
    price: 5499, category: 'Headphones',
    description: 'High-fidelity audio with Apple-designed drivers.',
    images: [{ id: 4, url: '/images/apple.png', productId: 4 }],
  },
];

// ─── AUTH ───
export async function login(data: LoginDto): Promise<AuthResponse> {
  return request<AuthResponse>('/session/auth', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  return request<AuthResponse>('/session/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── PRODUCTS ───
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await request<Product[]>('/product/all');
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const all = await getAllProducts();
    // Берём только первые 4 продукта
    return all.slice(0, 4);
  } catch {
    return MOCK_PRODUCTS.slice(0, 4);
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    return await request<Product>(`/product/${id}`);
  } catch {
    const mock = MOCK_PRODUCTS.find(p => p.id === id);
    if (!mock) throw new Error('Product not found');
    return mock;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await request<Product[]>(`/product/category/${category}`);
  } catch {
    return MOCK_PRODUCTS.filter(
      p => p.category?.toLowerCase() === category.toLowerCase()
    );
  }
}

export async function createProduct(data: ProductCreateDto): Promise<Product> {
  return request<Product>('/product', {
    method: 'POST',
    body: JSON.stringify({
      id: 0,
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId ?? null,
    }),
  });
}

export async function updateProduct(id: number, data: ProductCreateDto): Promise<Product> {
  return request<Product>(`/product/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId ?? null,
    }),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return request<void>(`/product/${id}`, { method: 'DELETE' });
}

export async function addProductImage(productId: number, url: string): Promise<void> {
  return request<void>(`/product/${productId}/image`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export async function updateProductImage(productId: number, url: string): Promise<void> {
  return request<void>(`/product/${productId}/image`, {
    method: 'PUT',
    body: JSON.stringify({ url }),
  });
}

export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
  return request<void>(`/product/${productId}/image/${imageId}`, {
    method: 'DELETE',
  });
}

// ─── CATEGORIES ───
export async function getAllCategories() {
  return request<{ id: number; name: string }[]>('/category/all');
}

export async function getCategoryById(id: number) {
  return request<{ id: number; name: string }>(`/category/${id}`);
}

export async function createCategory(data: { name: string }) {
  return request('/category/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: { name: string }) {
  return request(`/category/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number) {
  return request(`/category/delete/${id}`, { method: 'DELETE' });
}

// ─── SUBCATEGORIES ───
export async function getAllSubCategories() {
  return request<{ id: number; name: string; categoryId: number }[]>('/subcategory/all');
}

export async function getSubCategoriesByCategory(categoryId: number) {
  return request<{ id: number; name: string }[]>(
    `/subcategory/category/${categoryId}`
  );
}

export async function createSubCategory(data: { name: string; categoryId: number }) {
  return request('/subcategory', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── CART ───
export async function getCart(userId: number): Promise<CartResponse> {
  return request<CartResponse>(`/cart/${userId}`);
}

export async function addItemToCart(userId: number, data: CartItemDto): Promise<CartResponse> {
  return request<CartResponse>(`/cart/${userId}/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function removeCartItem(userId: number, itemId: number): Promise<CartResponse> {
  return request<CartResponse>(`/cart/${userId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function clearCart(userId: number): Promise<void> {
  return request<void>(`/cart/${userId}`, { method: 'DELETE' });
}

// ─── ORDERS ───
export async function getUserOrders(userId: number): Promise<OrderResponse[]> {
  return request<OrderResponse[]>(`/order/${userId}`);
}

export async function createOrder(data: OrderCreateDto): Promise<OrderResponse> {
  return request<OrderResponse>('/order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: number, status: number): Promise<OrderResponse> {
  return request<OrderResponse>(`/order/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(status),
  });
}

export async function deleteOrder(orderId: number): Promise<void> {
  return request<void>(`/order/${orderId}`, { method: 'DELETE' });
}

// ─── USERS ───
export async function getAllUsers(): Promise<UserResponse[]> {
  return request<UserResponse[]>('/user/all');
}

export async function getUserById(id: number): Promise<UserResponse> {
  return request<UserResponse>(`/user/${id}`);
}

export async function updateUser(id: number, data: UserCreateDto): Promise<UserResponse> {
  return request<UserResponse>(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number): Promise<void> {
  return request<void>(`/user/${id}`, { method: 'DELETE' });
}

// ─── PAYMENT ───
export async function createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
  return request<{ clientSecret: string }>('/payment/create-intent', {
    method: 'POST',
    // Умножаем на 100, так как Stripe ждет копейки/центы
    body: JSON.stringify({ amount: Math.round(amount * 100) }),
  });
}

export async function getAllOrders(): Promise<OrderResponse[]> {
  return request<OrderResponse[]>('/order/all');
}