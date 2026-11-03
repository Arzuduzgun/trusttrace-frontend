'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAgentAction } from '@/endpoints/users/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

export function CreateAgentForm() {
  const [state, formAction, isPending] = useActionState(createAgentAction, INITIAL_ACTION_RESULT);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2 rounded-md border p-3">
      <span className="text-sm font-medium">Temsilci ekle</span>
      <Input name="displayName" placeholder="Ad" className="h-9 w-40" required minLength={2} maxLength={80} />
      <Input name="email" type="email" placeholder="E-posta" className="h-9 w-56" required />
      <Input
        name="password"
        type="password"
        placeholder="Geçici şifre"
        className="h-9 w-40"
        required
        minLength={8}
        maxLength={72}
      />
      <Button type="submit" disabled={isPending}>
        Ekle
      </Button>
      {state.error && <span className="text-sm text-destructive">{state.error}</span>}
      {state.done && !state.error && <span className="text-sm text-green-700">Temsilci eklendi.</span>}
    </form>
  );
}