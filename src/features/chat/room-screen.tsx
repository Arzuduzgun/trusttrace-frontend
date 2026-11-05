import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMessageHistory } from '@/endpoints/messages/queries';
import { listProducts } from '@/endpoints/products/queries';
import { listMyRooms, listRoomMembers } from '@/endpoints/rooms/queries';
import type { SessionUser } from '@/types/auth.types';
import type { Room } from '@/types/room.types';
import { ChatWindow } from './chat-window';
import { RoomSidebar } from './room-sidebar';

interface RoomScreenProps {
  roomId: string;
  user: SessionUser;
  backHref: string;
  roomBasePath: string;
  readOnly?: boolean;
  toolbar?: (room: Room) => ReactNode;
}

export async function RoomScreen({
  roomId,
  user,
  backHref,
  roomBasePath,
  readOnly = false,
  toolbar,
}: RoomScreenProps) {
  const [rooms, products] = await Promise.all([listMyRooms(), listProducts()]);
  const room = rooms.find((candidate) => candidate.id === roomId);
  if (!room) {
    notFound();
  }
  const [history, members] = await Promise.all([
    getMessageHistory(room.id),
    listRoomMembers(room.id),
  ]);

  return (
    <div className="mx-auto flex h-full max-w-7xl gap-4 p-4">
      <RoomSidebar
        rooms={rooms}
        products={products}
        currentRoomId={room.id}
        basePath={roomBasePath}
        backHref={backHref}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Link href={backHref} className="text-sm text-muted-foreground hover:underline md:hidden">
          ← Odalar
        </Link>
        {toolbar?.(room)}
        <ChatWindow
          key={room.id}
          room={room}
          currentUser={{ id: user.id, displayName: user.displayName, role: user.role }}
          initialMessages={[...history].reverse()}
          initialMembers={members}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}