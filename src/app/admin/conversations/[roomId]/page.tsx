import { RoomScreen } from '@/features/chat/room-screen';
import { requireRole } from '@/lib/auth/session';

export default async function AdminConversationPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const user = await requireRole('ADMIN');
  return <RoomScreen roomId={roomId} user={user} backHref="/admin/conversations" readOnly />;
}