//Üç ceza işlemi: askıya alma, banlama ve cezayı kaldırma.
'use server';

import type { ActionResult } from '@/types/action-result.types';
import { serverFetch } from '@/lib/api/server-fetch';
import { createAgentSchema, reasonOnlySchema, suspendSchema } from './schemas';
import { runAction } from '@/lib/api/run-action';
import { CreateAgentRequest } from '@/types/api-schemas';
import { formText } from '@/lib/form-data';

export async function suspendUserAction(
  userId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = suspendSchema.safeParse({
    reason: formData.get('reason'),
    durationHours: formData.get('durationHours'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>(`/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}

export async function banUserAction(
  userId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = reasonOnlySchema.safeParse({ reason: formData.get('reason') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}

export async function revokeSanctionAction(
  userId: string,
  eventId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = reasonOnlySchema.safeParse({ reason: formData.get('reason') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>(`/admin/users/${userId}/sanctions/${eventId}/revoke`, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}

export async function createAgentAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
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