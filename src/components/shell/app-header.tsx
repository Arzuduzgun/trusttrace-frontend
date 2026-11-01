import type { SessionUser } from '@/endpoints/auth/types';
import { LogoutButton } from './logout-button';
import { ROLE_LABELS } from '@/lib/labels';

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <span className="font-semibold">TrustTrace</span>
      <div className="flex items-center gap-3 text-sm">
        <span>
          {user.displayName} · {ROLE_LABELS[user.role]}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}