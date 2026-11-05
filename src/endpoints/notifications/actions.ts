'use server';

import { serverFetchVoid } from '@/lib/api/server-fetch';

export async function markNotificationReadAction(id: string): Promise<void> {
  await serverFetchVoid(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
}

export async function markAllNotificationsReadAction(): Promise<void> {
  await serverFetchVoid('/notifications/read-all', { method: 'POST' });
}