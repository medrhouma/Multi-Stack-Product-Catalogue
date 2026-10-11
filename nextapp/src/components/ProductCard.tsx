import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  maxLength?: number;
}

export default function ProductCard({ product, maxLength = 80 }: ProductCardProps) {
  const excerpt =
    product.description.length > maxLength
      ? product.description.slice(0, maxLength).trimEnd() + '…'
      : product.description;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold text-gray-900">{product.title}</h2>
        <p className="mb-2 font-bold text-blue-600">${product.price.toFixed(2)}</p>
        <p className="flex-1 text-sm text-gray-500">{excerpt}</p>
        <Link
          href={`/products/${product.id}`}
          className="mt-3 rounded border border-blue-600 px-3 py-1.5 text-center text-sm text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          View details
        </Link>
      </div>
    </div>
  );
}