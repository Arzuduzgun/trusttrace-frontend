/*Access token’ın süresi dolunca server-fetch kullanıcıyı buraya gönderir.

Cookie’deki refresh token ile backend’den yeni bir token çifti ister.
Başarılıysa yeni token’ları cookie’ye yazar ve kullanıcıyı ana sayfasına gönderir.
Başarısızsa (refresh token da ölmüşse) cookie’leri siler ve login’e gönderir.*/
import { NextResponse, type NextRequest } from 'next/server';
import type { AuthResult } from '@/endpoints/auth/types';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch } from '@/lib/api/server-fetch';
import { clearTokens, getRefreshToken, saveTokens } from '@/lib/auth/cookies';
import { ROLE_HOME } from '@/lib/auth/role-home';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      const result = await serverFetch<AuthResult>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      await saveTokens(result);
      return NextResponse.redirect(new URL(ROLE_HOME[result.user.role], request.url));
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw error;
      }
    }
  }
  await clearTokens();
  return NextResponse.redirect(new URL('/login?reason=SESSION_EXPIRED', request.url));
}