'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerAction } from '@/endpoints/auth/actions';
import { registerSchema } from '@/endpoints/auth/schemas';
import { useLiveValidation } from '@/hooks/use-live-validation';
import type { RegisterState } from '@/types/auth.types';

type RegisterField = 'displayName' | 'email' | 'password' | 'passwordConfirm';

const INITIAL_STATE: RegisterState = {
  error: null,
  fieldErrors: {},
  values: { displayName: '', email: '' },
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_STATE);
  const { values, field, errorOf } = useLiveValidation<RegisterField>(registerSchema, {
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const errorsFor = (name: RegisterField) => {
    const message = errorOf(name);
    if (message) {
      return [message];
    }
    if (name === 'email' && values.email === state.values.email) {
      return state.fieldErrors.email;
    }
    return undefined;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Kayıt ol</CardTitle>
        <CardDescription>TrustTrace müşteri hesabı oluştur</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <FormField
            label="Ad"
            autoComplete="name"
            required
            errors={errorsFor('displayName')}
            {...field('displayName')}
          />
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
            autoComplete="new-password"
            hint="En az 8 karakter, en az bir harf ve bir rakam."
            required
            errors={errorsFor('password')}
            {...field('password')}
          />
          <FormField
            label="Şifre (tekrar)"
            type="password"
            autoComplete="new-password"
            required
            errors={errorsFor('passwordConfirm')}
            {...field('passwordConfirm')}
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