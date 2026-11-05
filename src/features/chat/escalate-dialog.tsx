'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { escalateRoomAction } from '@/endpoints/rooms/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';
import type { ActionResult } from '@/types/action-result.types';

function EscalateForm({ roomId, onDone }: { roomId: string; onDone: () => void }) {
  const [state, formAction, isPending] = useActionState(
    async (previous: ActionResult, formData: FormData) => {
      const result = await escalateRoomAction(roomId, previous, formData);
      if (result.done) {
        onDone();
      }
      return result;
    },
    INITIAL_ACTION_RESULT,
  );

  return (
    <form action={formAction} className="space-y-3">
      <Textarea name="note" rows={3} maxLength={500} placeholder="Neden iletiyorsun? (isteğe bağlı)" />
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Vazgeç</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'İletiliyor…' : 'Yöneticiye ilet'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EscalateDialog({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Yöneticiye ilet</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görüşmeyi yöneticiye ilet</DialogTitle>
          <DialogDescription>
            Yöneticilere bildirim gider ve görüşme &quot;yöneticiye iletildi&quot; olarak işaretlenir.
          </DialogDescription>
        </DialogHeader>
        <EscalateForm
          roomId={roomId}
          onDone={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}