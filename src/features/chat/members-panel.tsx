'use client';

import { SanctionDialog } from '@/features/users/sanction-dialog';
import { UserStatusBadge } from '@/features/users/user-status-badge';
import { MEMBER_ROLE_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/auth.types';
import type { RoomMember } from '@/types/room.types';

export function MembersPanel({
  members,
  viewer,
}: {
  members: RoomMember[];
  viewer: { id: string; role: UserRole };
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l lg:flex">
      <h2 className="border-b px-3 py-3 text-sm font-medium">Üyeler ({members.length})</h2>
      <ul className="flex-1 space-y-1 overflow-y-auto p-2">
        {members.map((member) => (
          <li key={member.userId} className="rounded-md p-2 text-sm hover:bg-muted">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  member.isOnline ? 'bg-green-500' : 'bg-muted-foreground/40',
                )}
              />
              <span className="truncate font-medium">
                {member.displayName}
                {member.userId === viewer.id && ' (sen)'}
              </span>
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {MEMBER_ROLE_LABELS[member.memberRole]}
              {member.email && ` · ${member.email}`}
            </div>
            {member.status && member.status !== 'ACTIVE' && (
              <div className="mt-1">
                <UserStatusBadge status={member.status} suspendedUntil={member.suspendedUntil} />
              </div>
            )}
            {viewer.role === 'ADMIN' && member.memberRole === 'CUSTOMER' && member.email && member.status && (
              <div className="mt-2">
                <SanctionDialog
                  user={{
                    id: member.userId,
                    email: member.email,
                    displayName: member.displayName,
                    role: 'CUSTOMER',
                    status: member.status,
                    suspendedUntil: member.suspendedUntil,
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}