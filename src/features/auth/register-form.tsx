'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerAction } from '@/endpoints/auth/actions';
import type { RegisterState } from '@/types/auth.types';

const INITIAL_STATE: RegisterState = {
  error: null,
  fieldErrors: {},
  values: { displayName: '', email: '' },
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_STATE);
  const formKey = `${state.values.displayName}|${state.values.email}`;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Kayıt ol</CardTitle>
        <CardDescription>TrustTrace müşteri hesabı oluştur</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={formAction} className="space-y-4">
          <FormField
            label="Ad"
            name="displayName"
            autoComplete="name"
            defaultValue={state.values.displayName}
            errors={state.fieldErrors.displayName}
            required
          />
          <FormField
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
            autoComplete="new-password"
            hint="En az 8 karakter, en az bir harf ve bir rakam."
            errors={state.fieldErrors.password}
            required
          />
          <FormField
            label="Şifre (tekrar)"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors.passwordConfirm}
            required
          />
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Kaydediliyor…' : 'Kayıt ol'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="underline">
              Giriş yap
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}