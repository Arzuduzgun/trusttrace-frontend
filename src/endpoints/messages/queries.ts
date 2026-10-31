//Bir odanın son 50 mesajını çeker (GET /rooms/:id/messages)
import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { ChatMessage } from './types';

export function getMessageHistory(roomId: string): Promise<ChatMessage[]> {
  return serverFetch<ChatMessage[]>(`/rooms/${roomId}/messages?limit=50`);
}