import type { AppNotification, NotificationType } from '@/types/notification.types';

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

const DESCRIBERS: Record<NotificationType, (notification: AppNotification) => string> = {
  ROOM_ASSIGNED: (notification) =>
    `${text(notification.payload['customerName']) || 'Bir müşteri'} sizinle özel görüşme başlattı.`,
  ROOM_ESCALATED: (notification) => {
    const note = text(notification.payload['note']);
    const agent = text(notification.payload['agentName']) || 'Bir temsilci';
    const room = text(notification.payload['roomName']);
    return `${agent}, "${room}" görüşmesini size iletti${note ? `: ${note}` : '.'}`;
    },
};

export function describeNotification(notification: AppNotification): string {
  return DESCRIBERS[notification.type](notification);
}