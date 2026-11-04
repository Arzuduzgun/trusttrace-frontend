import { NextResponse, type NextRequest } from 'next/server';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch } from '@/lib/api/server-fetch';
import { clearTokens, getRefreshToken, saveTokens } from '@/lib/auth/cookies';
import { ROLE_HOME } from '@/lib/auth/role-home';
import type { AuthResult } from '@/types/auth.types';

function safeNext(value: string | null): string | null {
  if (!value || !value.startsWith('/')) {
    return null;
  }
  if (value.startsWith('//') || value.startsWith('/\\') || value.startsWith('/auth/')) {
    return null;
  }
  return value;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      const result = await serverFetch<AuthResult>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      await saveTokens(result);
      const target = safeNext(request.nextUrl.searchParams.get('next')) ?? ROLE_HOME[result.user.role];
      return NextResponse.redirect(new URL(target, request.url));
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw error;
      }
    }
  }
  await clearTokens();
  return NextResponse.redirect(new URL('/login?reason=SESSION_EXPIRED', request.url));
}