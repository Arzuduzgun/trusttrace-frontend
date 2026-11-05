import { listProducts } from '@/endpoints/products/queries';
import { listMyRooms } from '@/endpoints/rooms/queries';
import { RoomList } from '@/features/chat/room-list';
import { StartDirectButton } from '@/features/chat/start-direct-button';
import { ProductCard } from '@/features/products/product-card';
import { ProductRoomAction } from '@/features/products/product-room-action';

export default async function ChatPage() {
  const [myRooms, products] = await Promise.all([listMyRooms(), listProducts()]);
  const joinedIds = new Set(myRooms.map((room) => room.id));

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Odalarım</h1>
          <StartDirectButton />
        </div>
        <RoomList rooms={myRooms} basePath="/chat" />
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Ürünler</h2>
          <p className="text-sm text-muted-foreground">
            Bir ürünün destek odasına katılarak temsilcimiz ve diğer kullanıcılarla konuşabilirsin.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product}>
              <ProductRoomAction
                roomId={product.roomId}
                roomStatus={product.roomStatus}
                joined={product.roomId !== null && joinedIds.has(product.roomId)}
              />
            </ProductCard>
          ))}
        </div>
      </section>
    </div>
  );
}