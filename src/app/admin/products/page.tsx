import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { listProducts } from '@/endpoints/products/queries';
import { CreateProductForm } from '@/features/products/create-product-form';
import { ProductCard } from '@/features/products/product-card';

export default async function AdminProductsPage() {
  const products = await listProducts();
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">Ürünler</h1>
      <CreateProductForm />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}>
            {product.roomId && (
              <Link
                href={`/admin/conversations/${product.roomId}`}
                className={buttonVariants({ size: 'sm', variant: 'outline', className: 'mt-2 w-full' })}
              >
                Odayı gör
              </Link>
            )}
          </ProductCard>
        ))}
      </div>
    </div>
  );
}