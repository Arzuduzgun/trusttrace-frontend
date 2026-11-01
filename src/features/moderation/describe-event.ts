//Bir defter kaydını tek satırlık, okunabilir bir cümleye çevirir.
import type { ModerationEvent } from '@/endpoints/moderation/types';
import { formatDateTime } from '@/lib/format';

const SANCTION_LABELS: Record<string, string> = { SUSPEND: 'Askı', BAN: 'Ban' };

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function patterns(value: unknown): string {
  if (!Array.isArray(value)) {
    return '';
  }
  return value
    .map((match: unknown) =>
      typeof match === 'object' && match !== null && 'pattern' in match ? text(match.pattern) : '',
    )
    .filter(Boolean)
    .join(', ');
}

export function describeEvent(event: ModerationEvent): string {
  const payload = event.payload;
  switch (event.eventType) {
    case 'VIOLATION_DETECTED': {
      const outcome = text(payload['verdict']) === 'BLOCK' ? 'engellendi' : 'işaretlendi';
      return `"${text(payload['messageBody'])}" — kural: ${patterns(payload['matches'])} (${outcome})`;
    }
    case 'SANCTION_IMPOSED': {
      const label = SANCTION_LABELS[text(payload['sanction'])] ?? 'Ceza';
      const until = text(payload['suspendedUntil']);
      return `${label} — ${text(payload['reason'])}${until ? ` (bitiş: ${formatDateTime(until)})` : ''}`;
    }
    case 'SANCTION_REVOKED': {
      const label = SANCTION_LABELS[text(payload['revokedSanction'])] ?? 'Ceza';
      return `${label} kaldırıldı — ${text(payload['reason'])}`;
    }
  }
}