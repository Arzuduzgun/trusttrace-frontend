//Admin kullanıcı listesini backend’den çeker.
import 'server-only';
import type { AdminUser, UserStatus } from '@/types/auth.types';
import { serverFetch } from '@/lib/api/server-fetch';

export function listUsers(status?: UserStatus): Promise<AdminUser[]> {
  const query = status ? `?status=${status}&limit=100` : '?limit=100';
  return serverFetch<AdminUser[]>(`/admin/users${query}`);
}