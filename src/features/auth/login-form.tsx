'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/form-field';
import { BrandLogo } from '@/components/shell/brand-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAction } from '@/endpoints/auth/actions';
import { loginSchema } from '@/endpoints/auth/schemas';
import { useLiveValidation } from '@/hooks/use-live-validation';
import type { LoginState } from '@/types/auth.types';

const INITIAL_STATE: LoginState = { error: null, fieldErrors: {}, values: { email: '' } };

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);
  const { field, errorOf } = useLiveValidation(loginSchema, { email: '', password: '' });
  const errorsFor = (name: 'email' | 'password') => {
    const message = errorOf(name);
    return message ? [message] : undefined;
  };

  return (
    <Card className="w-full max-w-sm shadow-xl shadow-indigo-500/10">
      <CardHeader className="space-y-3">
        <BrandLogo size="lg" />
        <CardTitle className="text-xl">Tekrar hoş geldin</CardTitle>
        <CardDescription>Müşteri hizmetleri platformuna giriş yap</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {notice && (
            <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{notice}</p>
          )}
          <FormField
            label="E-posta"
            type="email"
            autoComplete="email"
            required
            errors={errorsFor('email')}
            {...field('email')}
          />
          <FormField
            label="Şifre"
            type="password"
            autoComplete="current-password"
            required
            errors={errorsFor('password')}
            {...field('password')}
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
            <Link href="/register" className="font-medium text-primary underline">
              Kayıt ol
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}