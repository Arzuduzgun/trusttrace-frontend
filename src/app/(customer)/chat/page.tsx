import { JoinableRoomList } from '@/features/chat/joinable-room-list';
import { RoomList } from '@/features/chat/room-list';
import { StartDirectButton } from '@/features/chat/start-direct-button';
import { listMyRooms, listProductRooms } from '@/endpoints/rooms/queries';

export default async function ChatPage() {
  const [myRooms, productRooms] = await Promise.all([listMyRooms(), listProductRooms()]);
  const joinedIds = new Set(myRooms.map((room) => room.id));
  const joinableRooms = productRooms.filter((room) => !joinedIds.has(room.id));

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Odalarım</h1>
          <StartDirectButton />
        </div>
        <RoomList rooms={myRooms} basePath="/chat" />
      </section>
      {joinableRooms.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Katılabileceğin ürün odaları</h2>
          <JoinableRoomList rooms={joinableRooms} />
        </section>
      )}
    </div>
  );
}