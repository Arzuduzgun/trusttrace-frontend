import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { joinProductRoomAction } from '@/endpoints/rooms/actions';
import type { RoomStatus } from '@/types/room.types';

interface ProductRoomActionProps {
  roomId: string | null;
  roomStatus: RoomStatus | null;
  joined: boolean;
}

export function ProductRoomAction({ roomId, roomStatus, joined }: ProductRoomActionProps) {
  if (!roomId || roomStatus === 'CLOSED') {
    return (
      <Button size="sm" variant="outline" disabled className="mt-2 w-full">
        Destek kapalı
      </Button>
    );
  }
  if (joined) {
    return (
      <Link
        href={`/chat/${roomId}`}
        className={buttonVariants({ size: 'sm', variant: 'outline', className: 'mt-2 w-full' })}
      >
        Odaya git
      </Link>
    );
  }
  return (
    <form action={joinProductRoomAction.bind(null, roomId)} className="mt-2">
      <Button type="submit" size="sm" className="w-full">
        Destek odasına katıl
      </Button>
    </form>
  );
}