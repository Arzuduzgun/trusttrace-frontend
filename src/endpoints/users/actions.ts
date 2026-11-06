'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/api-error';
import { runAction } from '@/lib/api/run-action';
import { serverFetch } from '@/lib/api/server-fetch';
import { formText } from '@/lib/form-data';
import type { ActionResult, InviteActionResult } from '@/types/action-result.types';
import type { AgentCreated, AgentInvite, CreateAgentRequest } from '@/types/api-schemas';
import type { SanctionAction } from '@/types/moderation.types';
import { createAgentSchema, sanctionFormSchema } from './schemas';

const SANCTION_PATHS: Record<SanctionAction, string> = {
  SUSPEND: 'suspend',
  BAN: 'ban',
  REVOKE: 'revoke',
};

export async function sanctionUserAction(
  userId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = sanctionFormSchema.safeParse({
    action: formText(formData, 'action'),
    reasonCode: formText(formData, 'reasonCode'),
    note: formText(formData, 'note'),
    durationHours: formText(formData, 'durationHours'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  const { action, ...body } = parsed.data;
  return runAction(() =>
    serverFetch<unknown>(`/admin/users/${userId}/${SANCTION_PATHS[action]}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  );
}

async function inviteResult(task: () => Promise<AgentInvite>): Promise<InviteActionResult> {
  try {
    const invite = await task();
    revalidatePath('/admin', 'layout');
    return { error: null, done: true, invite };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, done: false, invite: null };
    }
    throw error;
  }
}

export async function createAgentAction(
  _previous: InviteActionResult,
  formData: FormData,
): Promise<InviteActionResult> {
  const parsed = createAgentSchema.safeParse({
    displayName: formText(formData, 'displayName'),
    email: formText(formData, 'email'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false, invite: null };
  }
  const body: CreateAgentRequest = parsed.data;
  return inviteResult(async () => {
    const created = await serverFetch<AgentCreated>('/admin/agents', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return created.invite;
  });
}

export async function issueInviteAction(userId: string): Promise<InviteActionResult> {
  return inviteResult(() =>
    serverFetch<AgentInvite>(`/admin/agents/${encodeURIComponent(userId)}/invite`, { method: 'POST' }),
  );
}
