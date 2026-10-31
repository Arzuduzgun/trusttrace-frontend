//Mesaj yazma kutusu ve Gönder butonu.
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Composer({ onSend, disabled }: { onSend: (body: string) => void; disabled: boolean }) {
  const [text, setText] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = text.trim();
    if (!body) {
      return;
    }
    onSend(body);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={disabled ? 'Bağlantı bekleniyor…' : 'Mesaj yaz…'}
        maxLength={2000}
        disabled={disabled}
        aria-label="Mesaj"
      />
      <Button type="submit" disabled={disabled || !text.trim()}>
        Gönder
      </Button>
    </form>
  );
}