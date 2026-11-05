'use server';

import { runAction } from '@/lib/api/run-action';
import { serverFetch } from '@/lib/api/server-fetch';
import { formText } from '@/lib/form-data';
import type { ActionResult } from '@/types/action-result.types';
import type { CreateProductRequest } from '@/types/product.types';
import { createProductSchema } from './schemas';

export async function createProductAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createProductSchema.safeParse({
    name: formText(formData, 'name'),
    description: formText(formData, 'description'),
    imageUrl: formText(formData, 'imageUrl'),
    price: formText(formData, 'price').replace(',', '.'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  const body: CreateProductRequest = {
    name: parsed.data.name,
    description: parsed.data.description,
    imageUrl: parsed.data.imageUrl,
    priceCents: Math.round(parsed.data.price * 100),
  };
  return runAction(() =>
    serverFetch<unknown>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  );
}