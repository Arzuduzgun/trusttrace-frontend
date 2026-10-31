//“Şu an kim giriş yapmış?” sorusunu cevaplar ve sayfaları rol bazında korur.
import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { SessionUser, UserRole } from '@/endpoints/auth/types';
import { serverFetch } from '../api/server-fetch';
import { getAccessToken } from './cookies';
import { ROLE_HOME } from './role-home';

//Cookie’de token yoksa null döner. Varsa backend’e GET /me sorar ve kullanıcıyı döner.
export const getSession = cache(async (): Promise<SessionUser | null> => {
  if (!(await getAccessToken())) {
    return null;
  }
  return serverFetch<SessionUser>('/me');
});

/*Giriş yapılmamışsa → /login.
Rol yetmiyorsa → kullanıcının kendi ana sayfası. Örneğin müşteri /admin’e girmeye çalışırsa /chat’e gönderilir.
Her şey yolundaysa kullanıcıyı döner.*/
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