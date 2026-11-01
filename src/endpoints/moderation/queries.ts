/*Defteri filtreleriyle birlikte çeker. URLSearchParams, filtreleri adres 
parametrelerine güvenli şekilde çeviriyor; özel karakterler bozulmuyor.*/
import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { ModerationEvent, ModerationEventType } from './types';

export function listModerationEvents(filter: {
  eventType?: ModerationEventType;
  userId?: string;
}): Promise<ModerationEvent[]> {
  const params = new URLSearchParams({ limit: '100' });
  if (filter.eventType) {
    params.set('eventType', filter.eventType);
  }
  if (filter.userId) {
    params.set('userId', filter.userId);
  }
  return serverFetch<ModerationEvent[]>(`/admin/moderation-events?${params.toString()}`);
}