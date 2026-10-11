import type { Category, Product, ProductPage } from '@/types/product';

const BASE = process.env.API_URL ?? 'http://localhost:4000/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

export function getProducts(opts: {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}): Promise<ProductPage> {
  const params = new URLSearchParams({ limit: String(opts.limit), skip: String(opts.skip) });
  if (opts.q) params.set('q', opts.q);
  if (opts.category) params.set('category', opts.category);
  return getJson<ProductPage>(`/products?${params}`);
}

export async function getProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE}/products/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as Product;
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>('/categories');
}