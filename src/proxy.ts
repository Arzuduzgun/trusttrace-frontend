import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from '@/lib/auth/cookie-config';
import { env } from '@/lib/env';
import { CURRENT_PATH_HEADER } from '@/lib/request-headers';
import type { ApiEnvelope } from '@/types/api-envelope.types';
import type { AuthResult } from '@/types/auth.types';

const REFRESH_MARGIN_SECONDS = 5;

function currentPath(request: NextRequest): string {
  const params = new URLSearchParams(request.nextUrl.search);
  params.delete('_rsc');
  const query = params.toString();
  return query ? `${request.nextUrl.pathname}?${query}` : request.nextUrl.pathname;
}

function expiresSoon(token: string): boolean {
  const payloadPart = token.split('.')[1];
  if (!payloadPart) {
    return true;
  }
  try {
    const payload: unknown = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    if (typeof payload !== 'object' || payload === null || !('exp' in payload)) {
      return true;
    }
    return typeof payload.exp !== 'number' || payload.exp - REFRESH_MARGIN_SECONDS <= Date.now() / 1000;
  } catch {
    return true;
  }
}

async function requestRefresh(refreshToken: string): Promise<AuthResult | null> {
  try {
    const response = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    const body = (await response.json()) as ApiEnvelope<AuthResult>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const shouldRefresh =
    !request.nextUrl.pathname.startsWith('/auth/') &&
    accessToken !== undefined &&
    refreshToken !== undefined &&
    expiresSoon(accessToken);

  const result = shouldRefresh && refreshToken ? await requestRefresh(refreshToken) : null;
  if (result) {
    request.cookies.set(ACCESS_COOKIE, result.accessToken);
    request.cookies.set(REFRESH_COOKIE, result.refreshToken);
  }

  const headers = new Headers(request.headers);
  headers.set(CURRENT_PATH_HEADER, currentPath(request));
  const response = NextResponse.next({ request: { headers } });

  if (result) {
    response.cookies.set(ACCESS_COOKIE, result.accessToken, cookieOptions());
    response.cookies.set(REFRESH_COOKIE, result.refreshToken, cookieOptions());
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};