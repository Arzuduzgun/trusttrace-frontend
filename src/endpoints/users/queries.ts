//Admin kullanıcı listesini backend’den çeker. Durum verilirse sadece o durumdakiler gelir.
import 'server-only';
import type { SessionUser, UserStatus } from '@/endpoints/auth/types';
import { serverFetch } from '@/lib/api/server-fetch';

export function listUsers(status?: UserStatus): Promise<SessionUser[]> {
  const query = status ? `?status=${status}&limit=100` : '?limit=100';
  return serverFetch<SessionUser[]>(`/admin/users${query}`);
}