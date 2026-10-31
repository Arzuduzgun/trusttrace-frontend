//Parantezli klasörler adrese yansımaz. Sayfanın adresi /auth/login değil, sadece /login. Parantez sadece dosyaları düzenlemek için.
import { LoginForm } from '@/features/auth/login-form';
import { LOGIN_REASON_MESSAGES } from '@/features/auth/login-reasons';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const notice = reason ? (LOGIN_REASON_MESSAGES[reason] ?? null) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <LoginForm notice={notice} />
    </main>
  );
}