//Üç ceza işlemi: askıya alma, banlama ve cezayı kaldırma.
'use server';

import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/lib/api/action-result';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch } from '@/lib/api/server-fetch';
import { reasonOnlySchema, suspendSchema } from './schemas';

async function run(task: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await task();
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, done: false };
    }
    throw error;
  }
  revalidatePath('/admin', 'layout');
  return { error: null, done: true };
}

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
  return run(() =>
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
  return run(() =>
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
  return run(() =>
    serverFetch<unknown>(`/admin/users/${userId}/sanctions/${eventId}/revoke`, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}