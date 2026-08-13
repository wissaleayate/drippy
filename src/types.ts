export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'children';
  brand: string;
  price: number;
  originalPrice?: number; // For discount display
  sizes: string[];
  image: string;
  gallery?: string[]; // additional product photos, main image is always gallery[0]
  stock?: number;
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured?: boolean;
}

export type Category = 'all' | 'men' | 'women' | 'children';

export interface FilterState {
  searchQuery: string;
  brand: string;
  maxPrice: number;
  size: string;
  sortBy: string;
  department?: string;
}