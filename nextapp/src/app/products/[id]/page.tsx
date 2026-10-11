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
      <Link href="/products" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Back to catalogue
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square rounded-lg bg-gray-100">
            <Image
              src={p.images[0] ?? p.thumbnail}
              alt={p.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.images.slice(1).map((img) => (
              <Image key={img} src={img} alt={p.title} width={72} height={72}
                     className="rounded border bg-gray-100" />
            ))}
          </div>
        </div>

        <div>
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">{p.category}</span>
          <h1 className="mt-2 text-2xl font-bold">{p.title}</h1>
          {p.brand && <p className="text-gray-500">by {p.brand}</p>}
          <p className="my-2 text-3xl font-bold text-blue-600">
            ${p.price.toFixed(2)}{' '}
            <span className="rounded bg-green-600 px-2 py-0.5 align-middle text-sm text-white">
              -{p.discountPercentage}%
            </span>
          </p>
          <p>⭐ {p.rating} · {p.availabilityStatus} ({p.stock} in stock)</p>
          <p className="my-3">{p.description}</p>
          <ul className="space-y-0.5 text-sm text-gray-500">
            <li>SKU: {p.sku}</li>
            <li>Weight: {p.weight}</li>
            <li>Min. order: {p.minimumOrderQuantity}</li>
            <li>Warranty: {p.warrantyInformation}</li>
            <li>Shipping: {p.shippingInformation}</li>
            <li>Returns: {p.returnPolicy}</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-1">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border px-2 py-0.5 text-xs">#{t}</span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mb-2 mt-8 text-xl font-semibold">Reviews</h2>
      {p.reviews.map((r) => (
        <div key={r.date + r.reviewerEmail} className="mb-2 rounded border bg-white p-3">
          <strong>{r.reviewerName}</strong> — ⭐ {r.rating}
          <span className="ml-2 text-xs text-gray-500">
            {new Date(r.date).toLocaleDateString('en-GB')}
          </span>
          <p>{r.comment}</p>
        </div>
      ))}
    </>
  );
}