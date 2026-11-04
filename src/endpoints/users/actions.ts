'use server';

import { runAction } from '@/lib/api/run-action';
import { serverFetch } from '@/lib/api/server-fetch';
import { formText } from '@/lib/form-data';
import type { ActionResult } from '@/types/action-result.types';
import type { CreateAgentRequest } from '@/types/api-schemas';
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

export async function createAgentAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createAgentSchema.safeParse({
    displayName: formText(formData, 'displayName'),
    email: formText(formData, 'email'),
    password: formText(formData, 'password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  const body: CreateAgentRequest = parsed.data;
  return runAction(() =>
    serverFetch<unknown>('/admin/agents', { method: 'POST', body: JSON.stringify(body) }),
  );
}