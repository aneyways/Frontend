export const ProductStatus = {
  Unknown: 0,
  Active: 1,
  Inactive: 2,
  Discontinued: 3,
  SoldOut: 4,
  OutOfStock: 5,
  PreOrder: 6,
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  0: 'Unknown',
  1: 'In Stock',
  2: 'Inactive',
  3: 'Discontinued',
  4: 'Sold Out',
  5: 'Out of Stock',
  6: 'Pre-Order',
};

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  subCategory?: string | null;
  categoryId?: number;
  subCategoryId?: number;
  images?: ProductImage[];
  status?: ProductStatus;
}

export interface ProductCreateDto {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  subCategoryId?: number;
  imageUrl?: string;
}