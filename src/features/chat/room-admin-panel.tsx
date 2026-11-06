import { Button } from '@/components/ui/button';
import { listRoomMembers } from '@/endpoints/rooms/queries';
import { setRoomStatusAction } from '@/endpoints/rooms/actions';
import { listUsers } from '@/endpoints/users/queries';
import type { Room } from '@/types/room.types';
import { AddAgentForm } from './add-agent-form';
import { ReplaceAgentForm } from './replace-agent-form';
import { RoomStatusBadge } from './room-status-badge';

export async function RoomAdminPanel({ room }: { room: Room }) {
  const [members, users] = await Promise.all([listRoomMembers(room.id), listUsers('ACTIVE')]);
  const memberIds = new Set(members.map((member) => member.userId));
  const availableAgents = users
    .filter((user) => user.role === 'AGENT' && !memberIds.has(user.id))
    .map((agent) => ({ id: agent.id, displayName: agent.displayName }));
  const currentAgents = members
    .filter((member) => member.memberRole === 'AGENT')
    .map((member) => ({ id: member.userId, displayName: member.displayName }));

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
      <span className="flex items-center gap-2">
        Durum: <RoomStatusBadge status={room.status} />
      </span>
      {room.status !== 'CLOSED' && (
        <form action={setRoomStatusAction.bind(null, room.id, 'CLOSED')}>
          <Button type="submit" size="sm" variant="outline">
            Kapat
          </Button>
        </form>
      )}
      {room.status !== 'OPEN' && (
        <form action={setRoomStatusAction.bind(null, room.id, 'OPEN')}>
          <Button type="submit" size="sm" variant="outline">
            Yeniden aç
          </Button>
        </form>
      )}
      <span className="mx-1 h-5 w-px bg-border" />
      <AddAgentForm roomId={room.id} agents={availableAgents} />
      <span className="mx-1 h-5 w-px bg-border" />
      <ReplaceAgentForm roomId={room.id} currentAgents={currentAgents} availableAgents={availableAgents} />
    </div>
  );
}
