//Defterdeki bir ceza kaydının yanındaki “Kaldır” formu.
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { revokeSanctionAction } from '@/endpoints/users/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

export function RevokeForm({ userId, eventId }: { userId: string; eventId: string }) {
  const [state, formAction, isPending] = useActionState(
    revokeSanctionAction.bind(null, userId, eventId),
    INITIAL_ACTION_RESULT,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <Input name="reason" placeholder="Kaldırma gerekçesi" className="h-8 w-44" required minLength={3} maxLength={500} />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        Kaldır
      </Button>
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
    </form>
  );
}