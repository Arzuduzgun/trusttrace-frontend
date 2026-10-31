//Oda listelerini backend’den çeker. Sadece sunucuda çalışır (server-only).
import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { Room } from './types';

export function listMyRooms(): Promise<Room[]> {
  return serverFetch<Room[]>('/rooms');
}

export function listProductRooms(): Promise<Room[]> {
  return serverFetch<Room[]>('/rooms/product');
}