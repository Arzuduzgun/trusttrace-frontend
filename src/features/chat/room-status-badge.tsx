import { cn } from '@/lib/utils';
import type { RoomStatus } from '@/types/room.types';

const STATUS_STYLES: Record<RoomStatus, { text: string; className: string }> = {
  OPEN: { text: 'Açık', className: 'bg-green-100 text-green-800' },
  ESCALATED: { text: 'Yöneticiye iletildi', className: 'bg-amber-100 text-amber-900' },
  CLOSED: { text: 'Kapalı', className: 'bg-muted text-muted-foreground' },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const style = STATUS_STYLES[status];
  return <span className={cn('rounded px-1.5 py-0.5 text-xs', style.className)}>{style.text}</span>;
}