//Kullanıcı tablosu. Sütunlar: kullanıcı (ad ve e-posta), rol, durum, işlemler.
import Link from 'next/link';
import type { SessionUser } from '@/endpoints/auth/types';
import { ROLE_LABELS } from '@/lib/labels';
import { SanctionForm } from './sanction-form';
import { UserStatusBadge } from './user-status-badge';

function UserActions({ user }: { user: SessionUser }) {
  if (user.role === 'ADMIN') {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const ledgerLink = (
    <Link href={`/admin/moderation-events?userId=${user.id}`} className="text-xs underline">
      {user.status === 'BANNED' ? 'Banı kaldırmak için deftere git' : 'Askıyı kaldırmak için deftere git'}
    </Link>
  );
  if (user.status === 'BANNED') {
    return ledgerLink;
  }
  return (
    <div className="space-y-2">
      {user.status === 'SUSPENDED' ? ledgerLink : <SanctionForm userId={user.id} mode="suspend" />}
      <SanctionForm userId={user.id} mode="ban" />
    </div>
  );
}

export function UsersTable({ users }: { users: SessionUser[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">Bu filtrede kullanıcı yok.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-md border">
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
                <div className="font-medium">{user.displayName}</div>
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