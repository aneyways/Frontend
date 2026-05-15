export type ProductStatus = 'available' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: number;
  name: string;
  price: number;
  status: ProductStatus;
  categoryId: number;
  category?: Category;
  images?: ProductImage[];
  description?: ProductDescription;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface ProductDescription {
  id: number;
  description: string | null;
  descriptionAdvanced?: DescriptionAdvanced;
}

export interface DescriptionAdvanced {
  id: number;
  h: number;
  w: number;
  l: number;
}

export interface Category {
  id: number;
  name: string;
}