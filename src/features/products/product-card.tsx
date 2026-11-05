import Image from 'next/image';
import type { ReactNode } from 'react';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product.types';

export function ProductCard({ product, children }: { product: Product; children?: ReactNode }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}
        <p className="mt-auto pt-2 text-base font-semibold text-orange-600">
          {formatPrice(product.priceCents)}
        </p>
        {children}
      </div>
    </article>
  );
}