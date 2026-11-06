import { AuthShell } from '@/components/shell/auth-shell';
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
    <AuthShell>
      <LoginForm notice={notice} />
    </AuthShell>
  );
}
