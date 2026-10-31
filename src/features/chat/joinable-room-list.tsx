//Müşterinin henüz katılmadığı ürün odaları; her birinin yanında bir Katıl butonu.
import { Button } from '@/components/ui/button';
import { joinProductRoomAction } from '@/endpoints/rooms/actions';
import type { Room } from '@/endpoints/rooms/types';

export function JoinableRoomList({ rooms }: { rooms: Room[] }) {
  return (
    <ul className="divide-y rounded-md border">
      {rooms.map((room) => (
        <li key={room.id} className="flex items-center justify-between p-3">
          <span>{room.name}</span>
          <form action={joinProductRoomAction.bind(null, room.id)}>
            <Button type="submit" size="sm" variant="outline">
              Katıl
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}