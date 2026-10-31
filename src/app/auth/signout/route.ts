/*Oturum bittiğinde (banlandığında, token iptal edildiğinde) server-fetch kullanıcıyı 
buraya gönderir. Cookie’leri siler ve kullanıcıyı, sebebi adreste yazarak login’e 
gönderir. Örneğin /login?reason=AUTH_ACCOUNT_BANNED. Login sayfası bu sebebi okuyup 
ekranda bir uyarı gösterecek.*/
import { NextResponse, type NextRequest } from 'next/server';
import { clearTokens } from '@/lib/auth/cookies';

export async function GET(request: NextRequest): Promise<NextResponse> {
  await clearTokens();
  const loginUrl = new URL('/login', request.url);
  const reason = request.nextUrl.searchParams.get('reason');
  if (reason) {
    loginUrl.searchParams.set('reason', reason);
  }
  return NextResponse.redirect(loginUrl);
}