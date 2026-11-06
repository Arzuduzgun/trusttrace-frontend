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

const AVATAR_TONES = [
  'from-indigo-500 to-violet-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
];

export function RoomSidebar({ rooms, products, currentRoomId, basePath, backHref }: RoomSidebarProps) {
  const imageByProduct = new Map(products.map((product) => [product.id, product.imageUrl]));
  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm md:flex">
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-3 py-3 text-white">
        <h2 className="text-sm font-semibold">Odalarım</h2>
        <Link href={backHref} className="rounded-full bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30">
          Tümü
        </Link>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {rooms.map((room, index) => {
          const image = room.productId ? imageByProduct.get(room.productId) : undefined;
          return (
            <li key={room.id}>
              <Link
                href={`${basePath}/${room.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-indigo-50',
                  room.id === currentRoomId &&
                    'bg-linear-to-r from-indigo-100 to-amber-50 font-medium text-indigo-800 ring-1 ring-indigo-200',
                )}
              >
                {image ? (
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-black/5">
                    <Image src={image} alt="" fill unoptimized className="object-cover" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-sm',
                      AVATAR_TONES[index % AVATAR_TONES.length],
                    )}
                  >
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