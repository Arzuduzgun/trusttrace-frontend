import type { AppNotification, NotificationType } from '@/types/notification.types';

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

const DESCRIBERS: Record<NotificationType, (notification: AppNotification) => string> = {
  ROOM_ASSIGNED: (notification) =>
    `${text(notification.payload['customerName']) || 'Bir müşteri'} sizinle özel görüşme başlattı.`,
};

export function describeNotification(notification: AppNotification): string {
  return DESCRIBERS[notification.type](notification);
}