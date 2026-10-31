//Müşterinin konuşma ekranı. Adresteki oda id’sini alır ve RoomScreen’e verir.
import { RoomScreen } from '@/features/chat/room-screen';
import { requireRole } from '@/lib/auth/session';

export default async function CustomerRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const user = await requireRole('CUSTOMER');
  return <RoomScreen roomId={roomId} user={user} backHref="/chat" />;
}