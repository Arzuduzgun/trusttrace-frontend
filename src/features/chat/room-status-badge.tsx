import { cn } from '@/lib/utils';
import type { RoomStatus } from '@/types/room.types';

const STATUS_STYLES: Record<RoomStatus, { text: string; className: string }> = {
  OPEN: { text: 'Açık', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  ESCALATED: { text: 'Yöneticiye iletildi', className: 'bg-amber-50 text-amber-800 ring-amber-500/30' },
  CLOSED: { text: 'Kapalı', className: 'bg-muted text-muted-foreground ring-border' },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const style = STATUS_STYLES[status];
  return <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', style.className)}>{style.text}</span>;
}