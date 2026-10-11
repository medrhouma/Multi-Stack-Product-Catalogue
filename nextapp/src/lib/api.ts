import type { Category, Product, ProductsResponse } from '@/types/product';

const BASE = 'https://dummyjson.com';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function getProducts(opts: {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams({ limit: String(opts.limit), skip: String(opts.skip) });
  if (opts.q) {
    params.set('q', opts.q);
    return getJson<ProductsResponse>(`/products/search?${params}`);
  }
  if (opts.category) {
    return getJson<ProductsResponse>(
      `/products/category/${encodeURIComponent(opts.category)}?${params}`,
    );
  }
  return getJson<ProductsResponse>(`/products?${params}`);
}

export async function getProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE}/products/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as Product;
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>('/products/categories');
}