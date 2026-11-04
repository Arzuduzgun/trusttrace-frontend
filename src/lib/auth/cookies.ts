import 'server-only';
import { cookies } from 'next/headers';
import type { TokenPair } from '@/types/auth.types';
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from './cookie-config';

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function saveTokens(tokens: TokenPair): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions());
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions());
}

export async function clearTokens(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}