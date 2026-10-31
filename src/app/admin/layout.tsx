import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('ADMIN');
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}