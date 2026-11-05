'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { addRoomMemberAction } from '@/endpoints/rooms/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

interface AgentOption {
  id: string;
  displayName: string;
}

export function AddAgentForm({ roomId, agents }: { roomId: string; agents: AgentOption[] }) {
  const [state, formAction, isPending] = useActionState(
    addRoomMemberAction.bind(null, roomId),
    INITIAL_ACTION_RESULT,
  );

  if (agents.length === 0) {
    return <span className="text-xs text-muted-foreground">Eklenebilecek temsilci yok.</span>;
  }
  return (
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="userId"
        defaultValue=""
        className="h-8 rounded-md border bg-background px-2 text-sm"
        aria-label="Temsilci"
      >
        <option value="" disabled>
          Temsilci seç
        </option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.displayName}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        Odaya ata
      </Button>
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
    </form>
  );
}