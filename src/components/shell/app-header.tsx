import type { SessionUser, UserRole } from '@/endpoints/auth/types';
import { LogoutButton } from './logout-button';

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Müşteri',
  AGENT: 'Temsilci',
  ADMIN: 'Yönetici',
};

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