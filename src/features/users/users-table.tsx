import Link from 'next/link';
import type { AdminUser, SessionUser } from '@/types/auth.types';
import { ROLE_LABELS } from '@/lib/labels';
import { UserStatusBadge } from './user-status-badge';
import { SanctionDialog } from './sanction-dialog';
import { InviteButton } from './invite-button';
import { cn } from '@/lib/utils';


function UserActions({ user }: { user: SessionUser }) {
  if (user.role === 'ADMIN') {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="flex flex-wrap items-start gap-3">
      <SanctionDialog user={user} />
      <Link href={`/admin/moderation-events?userId=${user.id}`} className="text-xs underline">
        Geçmiş
      </Link>
      {user.role === 'AGENT' && <InviteButton userId={user.id} />}
    </div>
  );
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">Bu filtrede kullanıcı yok.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Kullanıcı</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Durum</th>
            <th className="p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t align-top">
              <td className="p-2">
                <div className="flex items-center gap-2 font-medium">
                  <span
                    className={cn('size-2 rounded-full', user.isOnline ? 'bg-green-500' : 'bg-muted-foreground/40')}
                    title={user.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                  />
                  {user.displayName}
                </div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </td>
              <td className="p-2">{ROLE_LABELS[user.role]}</td>
              <td className="p-2">
                <UserStatusBadge status={user.status} suspendedUntil={user.suspendedUntil} />
              </td>
              <td className="p-2">
                <UserActions user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}