import type { UserStatus } from '@/types/auth.types';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<UserStatus, { text: string; className: string }> = {
  ACTIVE: { text: 'Aktif', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  SUSPENDED: { text: 'Askıda', className: 'bg-amber-50 text-amber-800 ring-amber-500/30' },
  BANNED: { text: 'Banlı', className: 'bg-red-50 text-red-700 ring-red-600/20' },
};

export function UserStatusBadge({ status, suspendedUntil }: { status: UserStatus; suspendedUntil: string | null }) {
  const style = STATUS_STYLES[status];
  return (
    <div className="space-y-1">
      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', style.className)}>{style.text}</span>
      {status === 'SUSPENDED' && (
        <div className="text-xs text-muted-foreground">
          {suspendedUntil ? `bitiş: ${formatDateTime(suspendedUntil)}` : 'süresiz'}
        </div>
      )}
    </div>
  );
}