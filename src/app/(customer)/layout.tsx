import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';
import { SocketProvider } from '@/providers/socket-provider';

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('CUSTOMER');
  return (
    <SocketProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader user={user} />
        <main className="flex-1">{children}</main>
      </div>
    </SocketProvider>
  );
}