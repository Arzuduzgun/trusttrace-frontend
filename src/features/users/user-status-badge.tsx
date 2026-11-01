//Yeşil “Aktif”, sarı “Askıda”, kırmızı “Banlı”. Askıdaysa altında bitiş zamanı ya da “süresiz” yazar.
import type { UserStatus } from '@/endpoints/auth/types';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<UserStatus, { text: string; className: string }> = {
  ACTIVE: { text: 'Aktif', className: 'bg-green-100 text-green-800' },
  SUSPENDED: { text: 'Askıda', className: 'bg-amber-100 text-amber-900' },
  BANNED: { text: 'Banlı', className: 'bg-red-100 text-red-800' },
};

export function UserStatusBadge({ status, suspendedUntil }: { status: UserStatus; suspendedUntil: string | null }) {
  const style = STATUS_STYLES[status];
  return (
    <div className="space-y-1">
      <span className={cn('rounded px-1.5 py-0.5 text-xs', style.className)}>{style.text}</span>
      {status === 'SUSPENDED' && (
        <div className="text-xs text-muted-foreground">
          {suspendedUntil ? `bitiş: ${formatDateTime(suspendedUntil)}` : 'süresiz'}
        </div>
      )}
    </div>
  );
}