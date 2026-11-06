import { AuthShell } from '@/components/shell/auth-shell';
import { RegisterForm } from '@/features/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
