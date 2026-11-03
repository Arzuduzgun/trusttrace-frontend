'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAction } from '@/endpoints/auth/actions';
import type { LoginState } from '@/types/auth.types';

const INITIAL_STATE: LoginState = {
  error: null,
  fieldErrors: {},
  values: { email: '' },
};

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">TrustTrace</CardTitle>
        <CardDescription>Müşteri hizmetleri platformuna giriş</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {notice && (
            <p className="rounded-md bg-amber-100 p-3 text-sm text-amber-900">{notice}</p>
          )}
          <FormField
            key={state.values.email}
            label="E-posta"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.values.email}
            errors={state.fieldErrors.email}
            required
          />
          <FormField
            label="Şifre"
            name="password"
            type="password"
            autoComplete="current-password"
            errors={state.fieldErrors.password}
            required
          />
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Hesabın yok mu?{' '}
            <Link href="/register" className="underline">
              Kayıt ol
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}