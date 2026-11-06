'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { issueInviteAction } from '@/endpoints/users/actions';
import { INITIAL_INVITE_RESULT } from '@/lib/api/action-result';
import { InviteLink } from './invite-link';

export function InviteButton({ userId }: { userId: string }) {
  const [state, formAction, isPending] = useActionState(
    issueInviteAction.bind(null, userId),
    INITIAL_INVITE_RESULT,
  );

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? 'Oluşturuluyor…' : 'Davet linki'}
        </Button>
      </form>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      {state.invite && <InviteLink invite={state.invite} />}
    </div>
  );
}
