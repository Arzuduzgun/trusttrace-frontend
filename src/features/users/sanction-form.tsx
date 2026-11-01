//Askıya alma ya da banlama formu. Hangisi olacağını mode parametresi belirliyor.
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { banUserAction, suspendUserAction } from '@/endpoints/users/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

export function SanctionForm({ userId, mode }: { userId: string; mode: 'suspend' | 'ban' }) {
  const action =
    mode === 'suspend' ? suspendUserAction.bind(null, userId) : banUserAction.bind(null, userId);
  const [state, formAction, isPending] = useActionState(action, INITIAL_ACTION_RESULT);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <Input name="reason" placeholder="Gerekçe" className="h-8 w-44" required minLength={3} maxLength={500} />
      {mode === 'suspend' && (
        <select
          name="durationHours"
          defaultValue="24"
          className="h-8 rounded-md border bg-background px-2 text-sm"
          aria-label="Askı süresi"
        >
          <option value="1">1 saat</option>
          <option value="24">1 gün</option>
          <option value="168">1 hafta</option>
          <option value="">Süresiz</option>
        </select>
      )}
      <Button
        type="submit"
        size="sm"
        variant={mode === 'ban' ? 'destructive' : 'outline'}
        disabled={isPending}
      >
        {mode === 'ban' ? 'Banla' : 'Askıya al'}
      </Button>
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
    </form>
  );
}