//Login formunun kendisi. En üstteki 'use client', bu bileşenin tarayıcıda çalıştığını söylüyor; çünkü kullanıcı yazarken, butona basarken ekran güncelleniyor.
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction, type LoginState } from '@/endpoints/auth/actions';

const INITIAL_STATE: LoginState = { error: null, fieldErrors: {} };

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>TrustTrace</CardTitle>
        <CardDescription>Müşteri hizmetleri platformuna giriş</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {notice && (
            <p className="rounded-md bg-amber-100 p-3 text-sm text-amber-900">{notice}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            {state.fieldErrors.email && (
              <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
            {state.fieldErrors.password && (
              <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
            )}
          </div>
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}