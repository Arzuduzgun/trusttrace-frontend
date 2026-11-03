'use server';

import { redirect } from 'next/navigation';
import { serverFetch } from '@/lib/api/server-fetch';
import type { Room } from './types';

export async function joinProductRoomAction(roomId: string): Promise<void> {
  await serverFetch<Room>(`/rooms/${roomId}/join`, { method: 'POST' });
  redirect(`/chat/${roomId}`);
}

export async function startDirectRoomAction(): Promise<void> {
  const room = await serverFetch<Room>('/rooms/direct', { method: 'POST' });
  redirect(`/chat/${room.id}`);
}