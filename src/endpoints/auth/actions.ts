/*Login ve logout işlemleri. En üstteki 'use server', bu fonksiyonların 
Next.js sunucusunda çalışacağını söylüyor. Form gönderilince tarayıcı bunları çağırır, 
ama kod tarayıcıya hiç gönderilmez.*/
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch, serverFetchVoid } from '@/lib/api/server-fetch';
import { clearTokens, getRefreshToken, saveTokens } from '@/lib/auth/cookies';
import { ROLE_HOME } from '@/lib/auth/role-home';
import { loginSchema } from './schemas';
import type { AuthResult } from './types';

export interface LoginState {
  error: string | null;
  fieldErrors: { email?: string[]; password?: string[] };
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: null, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  let result: AuthResult;
  try {
    result = await serverFetch<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: {} };
    }
    throw error;
  }
  await saveTokens(result);
  redirect(ROLE_HOME[result.user.role]);
}

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await serverFetchVoid('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw error;
      }
    }
  }
  await clearTokens();
  redirect('/login');
}

//Next.js sunucusunda çalışıp cookie’deki token’la bileti alıyor ve sadece bileti tarayıcıya döndürüyor.
export async function getWsTicketAction(): Promise<string> {
  const result = await serverFetch<{ ticket: string; expiresIn: number }>('/auth/ws-ticket', {
    method: 'POST',
  });
  return result.ticket;
}

//Oturumu zorla kapatır. Cookie’leri siler ve kullanıcıyı sebebiyle birlikte login sayfasına gönderir.
export async function forceSignOutAction(reason: string): Promise<void> {
  await clearTokens();
  redirect(`/login?reason=${encodeURIComponent(reason)}`);
}