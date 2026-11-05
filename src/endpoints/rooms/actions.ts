'use server';

import { redirect } from 'next/navigation';
import { serverFetch, serverFetchVoid } from '@/lib/api/server-fetch';
import type { Room, RoomMember, RoomStatus } from '../../types/room.types';
import { ActionResult } from '@/types/action-result.types';
import { runAction } from '@/lib/api/run-action';
import { formText } from '@/lib/form-data';
import { revalidatePath } from 'next/cache';

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
  const note = formText(formData, 'note').trim();
  if (note.length > 500) {
    return { error: 'Açıklama en fazla 500 karakter olabilir.', done: false };
  }
  return runAction(() =>
    serverFetch<unknown>(`/rooms/${encodeURIComponent(roomId)}/escalate`, {
      method: 'POST',
      body: JSON.stringify(note ? { note } : {}),
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