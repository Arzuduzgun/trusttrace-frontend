import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { listProducts } from '@/endpoints/products/queries';
import { listMyRooms } from '@/endpoints/rooms/queries';
import { RoomList } from '@/features/chat/room-list';
import { RoomStatusBadge } from '@/features/chat/room-status-badge';
import { ProductCard } from '@/features/products/product-card';

export default async function AgentHomePage() {
  const [rooms, products] = await Promise.all([listMyRooms(), listProducts()]);
  const myRoomIds = new Set(rooms.map((room) => room.id));
  const myProducts = products.filter((product) => product.roomId && myRoomIds.has(product.roomId));
  const directRooms = rooms.filter((room) => room.type === 'DIRECT');

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6">
      <section className="space-y-3">
        <h1 className="text-xl font-semibold">Özel görüşmeler</h1>
        <RoomList rooms={directRooms} basePath="/agent/rooms" />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Sorumlu olduğun ürün odaları</h2>
        {myProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sana atanmış bir ürün odası yok.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {myProducts.map((product) => (
              <ProductCard key={product.id} product={product}>
                <div className="mt-2 flex items-center gap-2">
                  {product.roomStatus && product.roomStatus !== 'OPEN' && (
                    <RoomStatusBadge status={product.roomStatus} />
                  )}
                  <Link
                    href={`/agent/rooms/${product.roomId}`}
                    className={buttonVariants({ size: 'sm', className: 'flex-1' })}
                  >
                    Odaya git
                  </Link>
                </div>
              </ProductCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}