export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'children';
  brand: string;
  price: number;
  originalPrice?: number; // For discount display
  sizes: string[];
  image: string;
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
}

