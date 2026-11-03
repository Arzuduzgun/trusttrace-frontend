//Login ve logout işlemleri.
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch, serverFetchVoid } from '@/lib/api/server-fetch';
import { clearTokens, getRefreshToken, saveTokens } from '@/lib/auth/cookies';
import { ROLE_HOME } from '@/lib/auth/role-home';
import { loginSchema, registerSchema } from './schemas';
import type { AuthResult, LoginState, RegisterState, WsTicket } from '../../types/auth.types';
import { fieldErrorsFromApiError } from '@/lib/api/field-errors';
import { formText } from '@/lib/form-data';
import { RegisterRequest } from '@/types/api-schemas';

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const values = { email: formText(formData, 'email') };
  const parsed = loginSchema.safeParse({ email: values.email, password: formText(formData, 'password') });
  if (!parsed.success) {
    return { error: null, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }
  let result: AuthResult;
  try {
    result = await serverFetch<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: {}, values };
    }
    throw error;
  }
  await saveTokens(result);
  redirect(ROLE_HOME[result.user.role]);
}

export async function registerAction(_previous: RegisterState, formData: FormData): Promise<RegisterState> {
  const values = { displayName: formText(formData, 'displayName'), email: formText(formData, 'email') };
  const parsed = registerSchema.safeParse({
    ...values,
    password: formText(formData, 'password'),
    passwordConfirm: formText(formData, 'passwordConfirm'),
  });
  if (!parsed.success) {
    return { error: null, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }
  const body: RegisterRequest = {
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    password: parsed.data.password,
  };
  let result: AuthResult;
  try {
    result = await serverFetch<AuthResult>('/auth/register', { method: 'POST', body: JSON.stringify(body) });
  } catch (error) {
    if (error instanceof ApiError) {
      const fieldErrors = fieldErrorsFromApiError(error);
      return { error: Object.keys(fieldErrors).length > 0 ? null : error.message, fieldErrors, values };
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

export async function getWsTicketAction(): Promise<string> {
  const result = await serverFetch<WsTicket>('/auth/ws-ticket', {
    method: 'POST',
  });
  return result.ticket;
}

//Oturumu zorla kapatır. Cookie’leri siler ve kullanıcıyı sebebiyle birlikte login sayfasına gönderir.
export async function forceSignOutAction(reason: string): Promise<void> {
  await clearTokens();
  redirect(`/login?reason=${encodeURIComponent(reason)}`);
}