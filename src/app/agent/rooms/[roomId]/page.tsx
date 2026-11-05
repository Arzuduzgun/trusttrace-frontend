import { RoomScreen } from '@/features/chat/room-screen';
import { requireRole } from '@/lib/auth/session';

export default async function AgentRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const user = await requireRole('AGENT');
  return <RoomScreen roomBasePath="/agent/rooms" roomId={roomId} user={user} backHref="/agent" />;
}