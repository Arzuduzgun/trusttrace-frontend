//Üç ceza işlemi: askıya alma, banlama ve cezayı kaldırma.
'use server';

import type { ActionResult } from '@/lib/api/action-result';
import { serverFetch } from '@/lib/api/server-fetch';
import { reasonOnlySchema, suspendSchema } from './schemas';
import { runAction } from '@/lib/api/run-action';

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