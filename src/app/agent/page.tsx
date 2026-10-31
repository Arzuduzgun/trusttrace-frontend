import { RoomList } from '@/features/chat/room-list';
import { listMyRooms } from '@/endpoints/rooms/queries';

export default async function AgentHomePage() {
  const rooms = await listMyRooms();
  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <h1 className="text-xl font-semibold">Bana atanan odalar</h1>
      <RoomList rooms={rooms} basePath="/agent/rooms" />
    </div>
  );
}