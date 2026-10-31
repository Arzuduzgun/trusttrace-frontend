'use server';

import { redirect } from 'next/navigation';
import { serverFetch } from '@/lib/api/server-fetch';
import type { Room } from './types';

//Ürün odasına katılır ve seni doğrudan o odanın konuşma ekranına götürür.
export async function joinProductRoomAction(roomId: string): Promise<void> {
  await serverFetch<Room>(`/rooms/${roomId}/join`, { method: 'POST' });
  redirect(`/chat/${roomId}`);
}

//Temsilciyle 1-1 oda açar ve seni o odaya götürür. Hangi temsilcinin atanacağına backend karar veriyor (en az meşgul olan).
export async function startDirectRoomAction(): Promise<void> {
  const room = await serverFetch<Room>('/rooms/direct', { method: 'POST' });
  redirect(`/chat/${room.id}`);
}