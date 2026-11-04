import 'server-only';
import { env } from '../env';

export const ACCESS_COOKIE = 'tt_access';
export const REFRESH_COOKIE = 'tt_refresh';

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}