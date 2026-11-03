import 'server-only';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/types/action-result.types';
import { ApiError } from './api-error';

export async function runAction(task: () => Promise<unknown>): Promise<ActionResult> {
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