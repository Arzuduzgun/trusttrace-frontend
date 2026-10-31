//Token cookie’lerini yazar, okur ve siler.
import 'server-only';
import { cookies } from 'next/headers';
import { env } from '../env';

const ACCESS_COOKIE = 'tt_access';
const REFRESH_COOKIE = 'tt_refresh';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const, //Başka sitelerden gelen form gönderimlerinde cookie gönderilmez
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

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