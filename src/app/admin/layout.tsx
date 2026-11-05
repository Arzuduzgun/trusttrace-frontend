import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';
import { AdminNav } from '@/components/shell/admin-nav';
import { SocketProvider } from '@/providers/socket-provider';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('ADMIN');
  return (
    <SocketProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader user={user} />
        <AdminNav />
        <main className="flex-1">{children}</main>
      </div>
    </SocketProvider>
  );
}