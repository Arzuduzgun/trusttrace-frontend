//“Yeni kural” formu
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRuleAction } from '@/endpoints/moderation/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

export function RuleForm() {
  const [state, formAction, isPending] = useActionState(createRuleAction, INITIAL_ACTION_RESULT);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2 rounded-md border p-3">
      <Input name="pattern" placeholder="Yasaklı kelime ya da cümle" className="h-9 w-64" required maxLength={200} />
      <select
        name="action"
        defaultValue="BLOCK"
        className="h-9 rounded-md border bg-background px-2 text-sm"
        aria-label="Eylem"
      >
        <option value="BLOCK">Engelle</option>
        <option value="FLAG">İşaretle</option>
      </select>
      <Button type="submit" disabled={isPending}>
        Ekle
      </Button>
      {state.error && <span className="text-sm text-destructive">{state.error}</span>}
    </form>
  );
}