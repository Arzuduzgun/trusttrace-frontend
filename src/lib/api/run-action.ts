/*Admin formlarının ortak işi. Backend isteğini çalıştırır; hata olursa mesajını forma 
döner; başarılıysa admin sayfalarını tazeler.*/
import 'server-only';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './action-result';
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