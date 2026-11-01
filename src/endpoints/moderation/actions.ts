'use server';

import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/lib/api/action-result';
import { runAction } from '@/lib/api/run-action';
import { serverFetch } from '@/lib/api/server-fetch';
import { createRuleSchema } from './schemas';

//Formu kontrol eder, POST /admin/moderation-rules gönderir.
export async function createRuleAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = createRuleSchema.safeParse({
    pattern: formData.get('pattern'),
    action: formData.get('action'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>('/admin/moderation-rules', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}

//Kuralı açar ya da kapatır: PATCH /admin/moderation-rules/:id
export async function toggleRuleAction(ruleId: string, isActive: boolean): Promise<void> {
  await serverFetch<unknown>(`/admin/moderation-rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  revalidatePath('/admin', 'layout');
}