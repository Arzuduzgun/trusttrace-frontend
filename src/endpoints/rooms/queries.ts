//Oda listelerini backend’den çeker.
import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { Room, RoomMember } from '../../types/room.types';

export function listMyRooms(): Promise<Room[]> {
  return serverFetch<Room[]>('/rooms');
}

export function listProductRooms(): Promise<Room[]> {
  return serverFetch<Room[]>('/rooms/product');
}

export function listRoomMembers(roomId: string): Promise<RoomMember[]> {
  return serverFetch<RoomMember[]>(`/rooms/${encodeURIComponent(roomId)}/members`);
}