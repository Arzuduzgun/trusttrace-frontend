import type { AgentInvite } from './api-schemas';

export interface ActionResult {
  error: string | null;
  done: boolean;
}

export interface InviteActionResult extends ActionResult {
  invite: AgentInvite | null;
}
