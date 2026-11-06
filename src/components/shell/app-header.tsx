import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROLE_HOME } from '@/lib/auth/role-home';
import { ROLE_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import type { SessionUser, UserRole } from '@/types/auth.types';
import { BrandLogo } from './brand-logo';
import { LogoutButton } from './logout-button';

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  AGENT: 'bg-emerald-100 text-emerald-700',
  CUSTOMER: 'bg-amber-100 text-amber-800',
};

export function AppHeader({ user, actions }: { user: SessionUser; actions?: ReactNode }) {
  return (
    <div className="shrink-0">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-amber-400 to-emerald-500" />
      <header className="flex items-center justify-between border-b bg-card/80 px-4 py-2.5 backdrop-blur">
        <Link href={ROLE_HOME[user.role]} className="transition-opacity hover:opacity-80">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {actions}
          <span className="flex items-center gap-2 rounded-full bg-muted py-1 pr-3 pl-1">
            <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden font-medium sm:inline">{user.displayName}</span>
            <span
              className={cn('rounded-full px-2 py-0.5 text-xs font-medium', ROLE_BADGE_STYLES[user.role])}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </span>
          <LogoutButton />
        </div>
      </header>
    </div>
  );
}
