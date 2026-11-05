import type { ReactNode } from 'react';
import { ROLE_LABELS } from '@/lib/labels';
import type { SessionUser } from '@/types/auth.types';
import { LogoutButton } from './logout-button';

export function AppHeader({ user, actions }: { user: SessionUser; actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <span className="text-xl font-bold">TrustTrace</span>
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