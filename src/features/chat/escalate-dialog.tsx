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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { escalateRoomAction } from '@/endpoints/rooms/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';
import { SANCTION_REASON_LABELS } from '@/lib/labels';
import type { ActionResult } from '@/types/action-result.types';

interface CustomerOption {
  id: string;
  displayName: string;
}

const SELECT_CLASS = 'h-9 w-full rounded-md border bg-background px-2 text-sm';

function EscalateForm({
  roomId,
  customers,
  onDone,
}: {
  roomId: string;
  customers: CustomerOption[];
  onDone: () => void;
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [reasonCode, setReasonCode] = useState('INSULT');
  const [note, setNote] = useState('');
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
  const noteRequired = reasonCode === 'OTHER';

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="escalate-customer">Bildirilen müşteri</Label>
        <select
          id="escalate-customer"
          name="customerId"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          className={SELECT_CLASS}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="escalate-reason">Gerekçe</Label>
        <select
          id="escalate-reason"
          name="reasonCode"
          value={reasonCode}
          onChange={(event) => setReasonCode(event.target.value)}
          className={SELECT_CLASS}
        >
          {Object.entries(SANCTION_REASON_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="escalate-note">Açıklama {noteRequired ? '(zorunlu)' : '(isteğe bağlı)'}</Label>
        <Textarea
          id="escalate-note"
          name="note"
          rows={3}
          maxLength={500}
          required={noteRequired}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Örneğin: Üç kez küfürlü mesaj gönderdi"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Vazgeç</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Bildiriliyor…' : 'Yöneticiye bildir'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EscalateDialog({ roomId, customers }: { roomId: string; customers: CustomerOption[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Yöneticiye bildir</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Müşteriyi yöneticiye bildir</DialogTitle>
          <DialogDescription>
            Bildirim ihlal defterine yazılır ve yöneticilere iletilir; görüşme incelemeye alınır.
          </DialogDescription>
        </DialogHeader>
        <EscalateForm
          roomId={roomId}
          customers={customers}
          onDone={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}