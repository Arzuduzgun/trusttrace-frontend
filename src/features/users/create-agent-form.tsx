'use client';

import { UserPlus } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAgentAction } from '@/endpoints/users/actions';
import { INITIAL_INVITE_RESULT } from '@/lib/api/action-result';
import { InviteLink } from './invite-link';

export function CreateAgentForm() {
  const [state, formAction, isPending] = useActionState(createAgentAction, INITIAL_INVITE_RESULT);

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <UserPlus className="size-4 text-primary" />
          Temsilci ekle
        </span>
        <Input name="displayName" placeholder="Ad" className="h-9 w-40" required minLength={2} maxLength={80} />
        <Input name="email" type="email" placeholder="E-posta" className="h-9 w-56" required />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Ekleniyor…' : 'Ekle ve davet linki oluştur'}
        </Button>
        {state.error && <span className="text-sm text-destructive">{state.error}</span>}
      </form>
      {state.invite && <InviteLink invite={state.invite} />}
    </div>
  );
}
