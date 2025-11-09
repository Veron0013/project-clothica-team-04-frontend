export type Product = {
  id: string;
  title: string;
  price: number;
  image: string; 
  rating?: number;
  reviewsCount?: number;
  category?: string;
};

export type GoodsResponse = {
  items: Product[];
  total: number;
};

export type GoodsQuery = {
  category?: string;
  size?: string[];
  color?: string[];
  gender?: string;
  limit: number; 
  offset: number; 
};