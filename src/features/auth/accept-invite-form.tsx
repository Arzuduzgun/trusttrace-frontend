'use client';

import { useActionState } from 'react';
import { FormField } from '@/components/form-field';
import { BrandLogo } from '@/components/shell/brand-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { acceptInviteAction } from '@/endpoints/auth/actions';
import { acceptInviteSchema } from '@/endpoints/auth/schemas';
import { useLiveValidation } from '@/hooks/use-live-validation';
import type { AcceptInviteState } from '@/types/auth.types';

type InviteField = 'password' | 'passwordConfirm';

const INITIAL_STATE: AcceptInviteState = { error: null, fieldErrors: {} };

interface AcceptInviteFormProps {
  token: string;
  displayName: string;
  email: string;
}

export function AcceptInviteForm({ token, displayName, email }: AcceptInviteFormProps) {
  const [state, formAction, isPending] = useActionState(
    acceptInviteAction.bind(null, token),
    INITIAL_STATE,
  );
  const { field, errorOf } = useLiveValidation<InviteField>(acceptInviteSchema, {
    password: '',
    passwordConfirm: '',
  });
  const errorsFor = (name: InviteField) => {
    const message = errorOf(name);
    return message ? [message] : state.fieldErrors[name];
  };

  return (
    <Card className="w-full max-w-sm shadow-xl shadow-indigo-500/10">
      <CardHeader className="space-y-3">
        <BrandLogo size="lg" />
        <CardTitle className="text-xl">Hoş geldin, {displayName}</CardTitle>
        <CardDescription>{email} hesabın için bir şifre belirle.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
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
            {isPending ? 'Kaydediliyor…' : 'Şifremi oluştur'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
