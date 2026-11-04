import { formatDateTime } from '@/lib/format';
import { REVOKE_REASON_LABELS, SANCTION_REASON_LABELS } from '@/lib/labels';
import type { ModerationEvent } from '@/types/moderation.types';

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

function reasonOf(payload: Record<string, unknown>, labels: Record<string, string>): string {
  const code = text(payload['reasonCode']);
  if (!code) {
    return text(payload['reason']);
  }
  const label = labels[code] ?? code;
  const note = text(payload['note']);
  return note ? `${label}: ${note}` : label;
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
      const reason = reasonOf(payload, SANCTION_REASON_LABELS);
      return `${label} — ${reason}${until ? ` (bitiş: ${formatDateTime(until)})` : ''}`;
    }
    case 'SANCTION_REVOKED': {
      const label = SANCTION_LABELS[text(payload['revokedSanction'])] ?? 'Ceza';
      return `${label} kaldırıldı — ${reasonOf(payload, REVOKE_REASON_LABELS)}`;
    }
  }
}