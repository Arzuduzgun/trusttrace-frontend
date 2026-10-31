//Sadece müşteri girebilir. Bu grubun sayfaları /chat gibi adreslerde.
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/shell/app-header';
import { requireRole } from '@/lib/auth/session';

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('CUSTOMER');
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}