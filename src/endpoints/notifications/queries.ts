import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { AppNotification } from '@/types/notification.types';

export function listNotifications(): Promise<AppNotification[]> {
  return serverFetch<AppNotification[]>('/notifications');
}