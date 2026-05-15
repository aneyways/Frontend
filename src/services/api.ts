import type { Product } from '../types/product.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7001/api';

// ─── HTTP клиент ───
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('accessToken');
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
  return res.json() as Promise<T>;
}

// ─── AUTH ───
export async function login(data: { userName: string; password: string }) {
  return request<{ token: string }>('/session/auth', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: {
  userName: string;
  password: string;
  email: string;
  contacts: string;
  dob: string;
  gender: number;
}) {
  return request<{ id: number; message: string }>('/reg', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── PRODUCTS ───
export async function getAllProducts(): Promise<Product[]> {
  return request<Product[]>('/product/getAll');
}

export async function getProductById(id: number): Promise<Product> {
  return request<Product>(`/product/${id}`);
}

export async function createProduct(product: Partial<Product>) {
  return request('/product', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(product: Partial<Product>) {
  return request('/product', {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: number) {
  return request(`/product/${id}`, { method: 'DELETE' });
}

// ─── ORDERS ───
export async function getAllOrders() {
  return request('/order');
}

export async function getOrderById(id: number) {
  return request(`/order/${id}`);
}

export async function createOrder(order: object) {
  return request('/order', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function updateOrder(order: object) {
  return request('/order', {
    method: 'PUT',
    body: JSON.stringify(order),
  });
}

export async function deleteOrder(id: number) {
  return request(`/order/${id}`, { method: 'DELETE' });
}

// ─── Временные моки пока бэкенд не поднят ───
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const all = await getAllProducts();
    return all.slice(0, 6);
  } catch {
    return MOCK_PRODUCTS;
  }
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Beats Solo 4 – Jennie Edition', price: 4299,
    status: 'available', categoryId: 1,
    category: { id: 1, name: 'Headphones' },
    images: [{ id: 1, url: 'images/beats.jennie.jpg', productId: 1 }],
    createdAt: '', updatedAt: '',
  },
    {
    id: 2, name: 'Bose QuietComfort 45', price: 2999,
    status: 'available', categoryId: 1,
    category: { id: 1, name: 'Headphones' },
    images: [{ id: 4, url: 'images/bose.jpg', productId: 2 }],
    createdAt: '', updatedAt: '',
  },
  {
    id: 3, name: 'Sony WH-1000XM5', price: 3799,
    status: 'available', categoryId: 1,
    category: { id: 1, name: 'Headphones' },
    images: [{ id: 2, url: 'images/sony.jpg', productId: 3 }],
    createdAt: '', updatedAt: '',
  },
    {
    id: 4, name: 'Apple AirPods Max', price: 5499,
    status: 'available', categoryId: 1,
    category: { id: 1, name: 'Headphones' },
    images: [{ id: 3, url: 'images/apple.png', productId: 4 }],
    createdAt: '', updatedAt: '',
  },
];