import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROLE_LABELS } from '@/lib/labels';
import { ROLE_HOME } from '@/lib/auth/role-home';
import type { SessionUser } from '@/types/auth.types';
import { LogoutButton } from './logout-button';

export function AppHeader({ user, actions }: { user: SessionUser; actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <Link href={ROLE_HOME[user.role]} className="text-xl font-bold hover:opacity-80">
        TrustTrace
      </Link>
      <div className="flex items-center gap-3 text-sm">
        {actions}
        <span>
          {user.displayName} · {ROLE_LABELS[user.role]}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
