export interface Category {
  id: number;
  name: string;
  productCount?: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPage {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
}