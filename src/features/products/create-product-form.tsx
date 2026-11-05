'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createProductAction } from '@/endpoints/products/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';

export function CreateProductForm() {
  const [state, formAction, isPending] = useActionState(createProductAction, INITIAL_ACTION_RESULT);

  return (
    <form action={formAction} className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
      <h2 className="font-medium md:col-span-2">Yeni ürün</h2>
      <Input name="name" placeholder="Ürün adı" required minLength={2} maxLength={100} />
      <Input name="price" placeholder="Fiyat (TL), örn. 249,90" required inputMode="decimal" />
      <Input
        name="imageUrl"
        placeholder="/products/dosya.jpg ya da https://..."
        required
        className="md:col-span-2"
      />
      <Textarea
        name="description"
        placeholder="Kısa açıklama"
        rows={2}
        maxLength={1000}
        className="md:col-span-2"
      />
      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Ekleniyor…' : 'Ürünü ve destek odasını oluştur'}
        </Button>
        {state.error && <span className="text-sm text-destructive">{state.error}</span>}
        {state.done && !state.error && <span className="text-sm text-green-700">Ürün eklendi.</span>}
      </div>
    </form>
  );
}