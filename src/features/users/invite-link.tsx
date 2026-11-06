'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import type { AgentInvite } from '@/types/api-schemas';

export function InviteLink({ invite }: { invite: AgentInvite }) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const url = `${origin}/invite/${invite.token}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div className="w-full min-w-72 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
      <p className="font-medium text-primary">Davet linki hazır</p>
      <p className="text-xs text-muted-foreground">
        Bu linki temsilciye ilet. Tek kullanımlık ve {formatDateTime(invite.expiresAt)} tarihine kadar geçerli.
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 font-mono text-xs"
          aria-label="Davet linki"
        />
        <Button type="button" size="sm" variant={copied ? 'success' : 'default'} onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? 'Kopyalandı' : 'Kopyala'}
        </Button>
      </div>
    </div>
  );
}
