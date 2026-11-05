import type { ReactNode } from 'react';
import { AdminNav } from '@/components/shell/admin-nav';
import { AppHeader } from '@/components/shell/app-header';
import { listNotifications } from '@/endpoints/notifications/queries';
import { NotificationBell } from '@/features/notifications/notification-bell';
import { requireRole } from '@/lib/auth/session';
import { SocketProvider } from '@/providers/socket-provider';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('ADMIN');
  const notifications = await listNotifications();
  return (
    <SocketProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader
          user={user}
          actions={<NotificationBell initial={notifications} roomBasePath="/admin/conversations" />}
        />
        <AdminNav />
        <main className="flex-1">{children}</main>
      </div>
    </SocketProvider>
  );
}