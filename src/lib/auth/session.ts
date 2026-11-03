import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { SessionUser, UserRole } from '@/endpoints/auth/types';
import { serverFetch } from '../api/server-fetch';
import { getAccessToken } from './cookies';
import { ROLE_HOME } from './role-home';

export const getSession = cache(async (): Promise<SessionUser | null> => {
  if (!(await getAccessToken())) {
    return null;
  }
  return serverFetch<SessionUser>('/me');
});

export async function requireRole(...roles: UserRole[]): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  if (!roles.includes(user.role)) {
    redirect(ROLE_HOME[user.role]);
  }
  return user;
}