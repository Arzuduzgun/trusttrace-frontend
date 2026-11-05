'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { verifyLedgerAction } from '@/endpoints/moderation/actions';
import type { ChainBreakReason, ChainVerification } from '@/types/moderation.types';

const REASON_LABELS: Record<ChainBreakReason, string> = {
  PREV_HASH_MISMATCH: 'zincir kopmuş (kayıt silinmiş ya da araya eklenmiş)',
  CONTENT_HASH_MISMATCH: 'kaydın içeriği değiştirilmiş',
};

export function LedgerVerifyButton() {
  const [result, formAction, isPending] = useActionState(
    async (): Promise<ChainVerification | null> => verifyLedgerAction(),
    null,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? 'Doğrulanıyor…' : 'Defteri doğrula'}
      </Button>
      {result?.valid && (
        <span className="text-sm text-green-700">
          ✓ Zincir sağlam — {result.checkedCount} kayıt doğrulandı
          {result.headHash && (
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              son hash: {result.headHash.slice(0, 12)}…
            </span>
          )}
        </span>
      )}
      {result && !result.valid && (
        <span className="text-sm font-medium text-red-700">
          ✗ Zincir #{result.brokenAtSeq} numaralı kayıtta bozulmuş:{' '}
          {result.reason ? REASON_LABELS[result.reason] : 'bilinmeyen neden'}
        </span>
      )}
    </form>
  );
}