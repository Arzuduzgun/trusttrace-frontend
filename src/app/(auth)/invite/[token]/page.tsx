import Link from 'next/link';
import { AuthShell } from '@/components/shell/auth-shell';
import { BrandLogo } from '@/components/shell/brand-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvitePreview } from '@/endpoints/auth/queries';
import { AcceptInviteForm } from '@/features/auth/accept-invite-form';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInvitePreview(token);

  return (
    <AuthShell>
      {invite ? (
        <AcceptInviteForm token={token} displayName={invite.displayName} email={invite.email} />
      ) : (
        <Card className="w-full max-w-sm shadow-xl shadow-indigo-500/10">
          <CardHeader className="space-y-3">
            <BrandLogo size="lg" />
            <CardTitle className="text-xl">Davet linki geçersiz</CardTitle>
            <CardDescription>
              Bu link kullanılmış, süresi dolmuş ya da hatalı olabilir. Yöneticinden yeni bir davet linki iste.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="text-sm font-medium text-primary underline">
              Giriş sayfasına dön
            </Link>
          </CardContent>
        </Card>
      )}
    </AuthShell>
  );
}
