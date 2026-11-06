'use client';

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
import { sanctionUserAction } from '@/endpoints/users/actions';
import { INITIAL_ACTION_RESULT } from '@/lib/api/action-result';
import { REVOKE_REASON_LABELS, SANCTION_ACTION_LABELS, SANCTION_REASON_LABELS } from '@/lib/labels';
import type { ActionResult } from '@/types/action-result.types';
import type { SessionUser, UserStatus } from '@/types/auth.types';
import type { SanctionAction } from '@/types/moderation.types';

const ACTIONS_BY_STATUS: Record<UserStatus, SanctionAction[]> = {
  ACTIVE: ['SUSPEND', 'BAN'],
  SUSPENDED: ['BAN', 'REVOKE'],
  BANNED: ['REVOKE'],
};

const DURATION_OPTIONS = [
  { value: '1', label: '1 saat' },
  { value: '24', label: '1 gün' },
  { value: '168', label: '1 hafta' },
  { value: '', label: 'Süresiz' },
];

const SELECT_CLASS = 'h-9 w-full rounded-md border bg-background px-2 text-sm';

function reasonOptions(action: SanctionAction): [string, string][] {
  return Object.entries(action === 'REVOKE' ? REVOKE_REASON_LABELS : SANCTION_REASON_LABELS);
}

function firstReason(action: SanctionAction): string {
  return reasonOptions(action)[0]?.[0] ?? 'OTHER';
}

function SanctionDialogForm({ user, onDone }: { user: SessionUser; onDone: () => void }) {
  const actions = ACTIONS_BY_STATUS[user.status];
  const [action, setAction] = useState<SanctionAction>(actions[0] ?? 'SUSPEND');
  const [reasonCode, setReasonCode] = useState(() => firstReason(actions[0] ?? 'SUSPEND'));
  const [durationHours, setDurationHours] = useState('24');
  const [note, setNote] = useState('');
  const [state, formAction, isPending] = useActionState(
    async (previous: ActionResult, formData: FormData) => {
      const result = await sanctionUserAction(user.id, previous, formData);
      if (result.done) {
        onDone();
      }
      return result;
    },
    INITIAL_ACTION_RESULT,
  );

  function changeAction(value: string) {
    const next = actions.find((item) => item === value);
    if (next) {
      setAction(next);
      setReasonCode(firstReason(next));
    }
  }

  const noteRequired = reasonCode === 'OTHER';

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sanction-action">Yapılacak işlem</Label>
        <select
          id="sanction-action"
          name="action"
          value={action}
          onChange={(event) => changeAction(event.target.value)}
          className={SELECT_CLASS}
        >
          {actions.map((item) => (
            <option key={item} value={item}>
              {SANCTION_ACTION_LABELS[item]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sanction-reason">Gerekçe</Label>
        <select
          id="sanction-reason"
          name="reasonCode"
          value={reasonCode}
          onChange={(event) => setReasonCode(event.target.value)}
          className={SELECT_CLASS}
        >
          {reasonOptions(action).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {action === 'SUSPEND' && (
        <div className="space-y-2">
          <Label htmlFor="sanction-duration">Süre</Label>
          <select
            id="sanction-duration"
            name="durationHours"
            value={durationHours}
            onChange={(event) => setDurationHours(event.target.value)}
            className={SELECT_CLASS}
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="sanction-note">
          Açıklama {noteRequired ? '(zorunlu)' : '(isteğe bağlı)'}
        </Label>
        <Textarea
          id="sanction-note"
          name="note"
          rows={3}
          maxLength={500}
          required={noteRequired}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Örneğin: Ürün odasında tekrarlayan küfürlü mesajlar"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Vazgeç</DialogClose>
        <Button
          type="submit"
          variant={action === 'BAN' ? 'destructive' : 'default'}
          disabled={isPending}
        >
          {isPending ? 'Uygulanıyor…' : SANCTION_ACTION_LABELS[action]}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function SanctionDialog({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              size="sm"
              className="bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25 hover:from-rose-400 hover:to-pink-400"
            />
          }
        >
          İşlem yap
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.displayName}</DialogTitle>
          <DialogDescription>{user.email} için yapılacak işlemi seçin.</DialogDescription>
        </DialogHeader>
        <SanctionDialogForm user={user} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}