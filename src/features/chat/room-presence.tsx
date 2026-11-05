import { cn } from '@/lib/utils';
import type { RoomMember } from '@/types/room.types';

export function RoomPresence({ members, viewerId }: { members: RoomMember[]; viewerId: string }) {
  const others = members.filter((member) => member.userId !== viewerId);
  const [onlyOther] = others;
  if (others.length === 1 && onlyOther) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn('size-2 rounded-full', onlyOther.isOnline ? 'bg-green-500' : 'bg-muted-foreground/40')}
        />
        {onlyOther.displayName} · {onlyOther.isOnline ? 'çevrimiçi' : 'çevrimdışı'}
      </span>
    );
  }
  const onlineCount = others.filter((member) => member.isOnline).length;
  return (
    <span className="text-xs text-muted-foreground">
      {members.length} üye · {onlineCount} çevrimiçi
    </span>
  );
}