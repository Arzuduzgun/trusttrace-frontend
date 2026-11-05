import Link from 'next/link';
import type { Room, RoomType } from '@/types/room.types';
import { RoomStatusBadge } from './room-status-badge';

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  DIRECT: 'Özel görüşme',
  PRODUCT: 'Ürün odası',
};

export function RoomList({ rooms, basePath }: { rooms: Room[]; basePath: string }) {
  if (rooms.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz bir odanız yok.</p>;
  }
  return (
    <ul className="divide-y rounded-md border">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link href={`${basePath}/${room.id}`} className="flex items-center justify-between p-3 hover:bg-muted">
            <span>{room.name}</span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {room.status !== 'OPEN' && <RoomStatusBadge status={room.status} />}
              {ROOM_TYPE_LABELS[room.type]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}