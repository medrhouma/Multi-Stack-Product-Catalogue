import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/api';

const LIMIT = 12;

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}

function href(page: number, q: string, category: string): string {
  const p = new URLSearchParams();
  if (page > 1) p.set('page', String(page));
  if (q) p.set('q', q);
  if (category) p.set('category', category);
  const qs = p.toString();
  return qs ? `/products?${qs}` : '/products';
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { page, q = '', category = '' } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const skip = (current - 1) * LIMIT;

  const [data, categories] = await Promise.all([
    getProducts({ limit: LIMIT, skip, q, category }),
    getCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(data.total / LIMIT));
  const btn = 'rounded border border-gray-300 px-4 py-2 text-sm';
  const disabled = `${btn} cursor-not-allowed opacity-40`;

  return (
    <>
      <div className="catalogue-heading">
        <div><p className="catalogue-eyebrow">Discover something useful</p><h1>Product catalogue</h1></div>
        <span>{data.total} products</span>
      </div>

      <form action="/products" className="catalogue-filters">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="flex-1 rounded border border-gray-300 px-3 py-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">Search</button>
        </div>
        <select
          name="category"
          defaultValue={category}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </form>

      {data.products.length === 0 ? (
        <p className="rounded bg-blue-50 p-4 text-blue-800">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}

      <nav className="mt-8 flex items-center justify-between">
        {current > 1 ? (
          <Link href={href(current - 1, q, category)} className={btn}>Previous</Link>
        ) : (
          <span className={disabled}>Previous</span>
        )}
        <span className="text-sm text-gray-500">
          Page {current} of {totalPages}
        </span>
        {current < totalPages ? (
          <Link href={href(current + 1, q, category)} className={btn}>Next</Link>
        ) : (
          <span className={disabled}>Next</span>
        )}
      </nav>
    </>
  );
}