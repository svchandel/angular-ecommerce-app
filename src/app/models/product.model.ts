export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface ProductVariant {
  size?: string;
  color?: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variants?: ProductVariant;
}

export interface ProductFilters {
  title?: string;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  offset?: number;
  limit?: number;
}

export interface PaginationInfo {
  offset: number;
  limit: number;
  total: number;
} 