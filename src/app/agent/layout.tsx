import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { listNotifications } from '@/endpoints/notifications/queries';
import { NotificationBell } from '@/features/notifications/notification-bell';
import { requireRole } from '@/lib/auth/session';
import { SocketProvider } from '@/providers/socket-provider';

export default async function AgentLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('AGENT');
  const notifications = await listNotifications();
  return (
    <SocketProvider>
      <div className="flex h-screen flex-col">
        <AppHeader user={user} actions={<NotificationBell initial={notifications} roomBasePath="/agent/rooms" />} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  );
}