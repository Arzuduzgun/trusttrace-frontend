'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { replaceRoomAgentAction } from '@/endpoints/rooms/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

interface AgentOption {
  id: string;
  displayName: string;
}

const SELECT_CLASS = 'h-8 rounded-md border bg-background px-2 text-sm';

export function ReplaceAgentForm({
  roomId,
  currentAgents,
  availableAgents,
}: {
  roomId: string;
  currentAgents: AgentOption[];
  availableAgents: AgentOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    replaceRoomAgentAction.bind(null, roomId),
    INITIAL_ACTION_RESULT,
  );

  if (currentAgents.length === 0 || availableAgents.length === 0) {
    return null;
  }
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <select name="currentAgentId" defaultValue="" className={SELECT_CLASS} aria-label="Çıkarılacak temsilci">
        <option value="" disabled>
          Çıkarılacak temsilci
        </option>
        {currentAgents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.displayName}
          </option>
        ))}
      </select>
      <span className="text-muted-foreground">→</span>
      <select name="newAgentId" defaultValue="" className={SELECT_CLASS} aria-label="Yeni temsilci">
        <option value="" disabled>
          Yeni temsilci
        </option>
        {availableAgents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.displayName}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" variant="destructive" disabled={isPending}>
        Temsilciyi değiştir
      </Button>
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
      {state.done && !state.error && <span className="text-xs text-green-600">Temsilci değiştirildi.</span>}
    </form>
  );
}
