import type { InputHTMLAttributes } from 'react';
import { PasswordInput } from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
}

export function FormField({ label, name, errors, hint, ...inputProps }: FormFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(errors?.length);
  const FieldInput = inputProps.type === 'password' ? PasswordInput : Input;
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <FieldInput
        id={name}
        name={name}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        {...inputProps}
      />
      {hint && !hasError && <p className="text-xs text-muted-foreground">{hint}</p>}
      {hasError && (
        <p id={errorId} className="text-sm text-destructive">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}
