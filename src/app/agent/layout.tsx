import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';

export default async function AgentLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('AGENT');
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}