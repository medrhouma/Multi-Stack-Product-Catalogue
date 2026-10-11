import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const p = await getProduct(numericId);
  if (!p) notFound();

  return (
    <>
      <Link href="/products" className="back-catalogue-link">
        <span className="back-catalogue-icon" aria-hidden="true">←</span>
        <span><small>Navigation</small>Back to catalogue</span>
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square rounded-lg bg-gray-100">
          <Image
            src={p.thumbnail}
            alt={p.title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain"
          />
        </div>

        <div>
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">{p.category.name}</span>
          <h1 className="mt-2 text-2xl font-bold">{p.title}</h1>
          <p className="my-2 text-3xl font-bold text-blue-600">${p.price.toFixed(2)}</p>
          <p className="mb-3">
            {p.stock > 0 ? (
              <span className="rounded bg-green-600 px-2 py-0.5 text-sm text-white">In stock ({p.stock})</span>
            ) : (
              <span className="rounded bg-red-600 px-2 py-0.5 text-sm text-white">Out of stock</span>
            )}
          </p>
          <p className="mb-3">{p.description}</p>
          <ul className="space-y-0.5 text-sm text-gray-500">
            <li>ID: {p.id}</li>
            <li>Created: {new Date(p.createdAt).toLocaleString('en-GB')}</li>
            <li>Updated: {new Date(p.updatedAt).toLocaleString('en-GB')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}