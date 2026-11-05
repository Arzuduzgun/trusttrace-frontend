import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product.types';
import type { Room } from '@/types/room.types';
import { RoomStatusBadge } from './room-status-badge';

interface RoomSidebarProps {
  rooms: Room[];
  products: Product[];
  currentRoomId: string;
  basePath: string;
  backHref: string;
}

export function RoomSidebar({ rooms, products, currentRoomId, basePath, backHref }: RoomSidebarProps) {
  const imageByProduct = new Map(products.map((product) => [product.id, product.imageUrl]));
  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-hidden rounded-lg border md:flex">
      <div className="flex items-center justify-between border-b px-3 py-3">
        <h2 className="text-sm font-medium">Odalarım</h2>
        <Link href={backHref} className="text-xs text-muted-foreground hover:underline">
          Tümü
        </Link>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {rooms.map((room) => {
          const image = room.productId ? imageByProduct.get(room.productId) : undefined;
          return (
            <li key={room.id}>
              <Link
                href={`${basePath}/${room.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-md p-2 text-sm hover:bg-muted',
                  room.id === currentRoomId && 'bg-muted font-medium',
                )}
              >
                {image ? (
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={image} alt="" fill unoptimized className="object-cover" />
                  </span>
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {room.name.charAt(0)}
                  </span>
                )}
                <span className="min-w-0 flex-1 space-y-0.5">
                  <span className="block truncate">{room.name}</span>
                  {room.status !== 'OPEN' && <RoomStatusBadge status={room.status} />}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}