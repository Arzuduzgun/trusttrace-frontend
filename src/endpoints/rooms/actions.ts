'use server';

import { redirect } from 'next/navigation';
import { serverFetch, serverFetchVoid } from '@/lib/api/server-fetch';
import type { Room, RoomMember, RoomStatus } from '../../types/room.types';
import { ActionResult } from '@/types/action-result.types';
import { runAction } from '@/lib/api/run-action';
import { formText } from '@/lib/form-data';
import { revalidatePath } from 'next/cache';
import { escalateSchema } from './schemas';

export async function joinProductRoomAction(roomId: string): Promise<void> {
  await serverFetch<Room>(`/rooms/${roomId}/join`, { method: 'POST' });
  redirect(`/chat/${roomId}`);
}

export async function startDirectRoomAction(): Promise<void> {
  const room = await serverFetch<Room>('/rooms/direct', { method: 'POST' });
  redirect(`/chat/${room.id}`);
}

export async function getRoomMembersAction(roomId: string): Promise<RoomMember[]> {
  return serverFetch<RoomMember[]>(`/rooms/${encodeURIComponent(roomId)}/members`);
}

export async function escalateRoomAction(
  roomId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = escalateSchema.safeParse({
    customerId: formText(formData, 'customerId'),
    reasonCode: formText(formData, 'reasonCode'),
    note: formText(formData, 'note'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>(`/rooms/${encodeURIComponent(roomId)}/escalate`, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    }),
  );
}

export async function setRoomStatusAction(roomId: string, status: RoomStatus): Promise<void> {
  await serverFetch<unknown>(`/admin/rooms/${encodeURIComponent(roomId)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
  revalidatePath('/admin', 'layout');
}

export async function addRoomMemberAction(
  roomId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = formText(formData, 'userId');
  if (!userId) {
    return { error: 'Bir temsilci seçin.', done: false };
  }
  return runAction(() =>
    serverFetchVoid(`/admin/rooms/${encodeURIComponent(roomId)}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
  );
}