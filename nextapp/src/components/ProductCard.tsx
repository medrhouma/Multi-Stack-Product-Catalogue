import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  maxLength?: number;
  priority?: boolean;
}


export default function ProductCard({ product, maxLength = 80, priority = false }: ProductCardProps) {
  const excerpt =
    product.description.length > maxLength
      ? product.description.slice(0, maxLength).trimEnd() + '…'
      : product.description;

  return (
    <article className="product-card">
      <div className="product-card-image">
        <Image
  src={product.thumbnail}
  alt={product.title}
  fill
  priority={priority}
  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
  className="object-contain"
/>
      </div>
      <div className="product-card-body">
        <h2>{product.title}</h2>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <p className="product-card-description">{excerpt}</p>
        <Link
          href={`/products/${product.id}`}
          className="product-card-link"
        >
          View details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}