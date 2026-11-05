import { SANCTION_REASON_LABELS } from '@/lib/labels';
import type { AppNotification, NotificationType } from '@/types/notification.types';

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function reasonLabel(code: string): string {
  const labels: Record<string, string> = SANCTION_REASON_LABELS;
  return labels[code] ?? code;
}

const DESCRIBERS: Record<NotificationType, (notification: AppNotification) => string> = {
  ROOM_ASSIGNED: (notification) =>
    `${text(notification.payload['customerName']) || 'Bir müşteri'} sizinle özel görüşme başlattı.`,
  ROOM_ESCALATED: (notification) => {
    const payload = notification.payload;
    const agent = text(payload['agentName']) || 'Bir temsilci';
    const customer = text(payload['customerName']) || 'bir müşteriyi';
    const note = text(payload['note']);
    return `${agent}, "${text(payload['roomName'])}" odasında ${customer} kullanıcısını bildirdi — ${reasonLabel(text(payload['reasonCode']))}${note ? `: ${note}` : ''}`;
    },
};

export function describeNotification(notification: AppNotification): string {
  return DESCRIBERS[notification.type](notification);
}