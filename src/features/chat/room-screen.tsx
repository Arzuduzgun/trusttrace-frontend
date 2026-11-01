//Konuşma sayfasının sunucu tarafı.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { SessionUser } from '@/endpoints/auth/types';
import { getMessageHistory } from '@/endpoints/messages/queries';
import { listMyRooms } from '@/endpoints/rooms/queries';
import { ChatWindow } from './chat-window';

interface RoomScreenProps {
  roomId: string;
  user: SessionUser;
  backHref: string;
  readOnly?: boolean;
}

export async function RoomScreen({ roomId, user, backHref, readOnly = false }: RoomScreenProps) {
  const rooms = await listMyRooms();
  const room = rooms.find((candidate) => candidate.id === roomId);
  if (!room) {
    notFound();
  }
  const history = await getMessageHistory(room.id);

  return (
    <div className="mx-auto flex h-[calc(100vh-57px)] max-w-3xl flex-col gap-2 p-4">
      <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
        ← Odalar
      </Link>
      <ChatWindow
        room={room}
        currentUser={{ id: user.id, displayName: user.displayName }}
        initialMessages={[...history].reverse()}
        readOnly={readOnly}
      />
    </div>
  );
}