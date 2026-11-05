import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';
import { SocketProvider } from '@/providers/socket-provider';

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('CUSTOMER');
  return (
    <SocketProvider>
      <div className="flex h-screen flex-col">
        <AppHeader user={user} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  );
}