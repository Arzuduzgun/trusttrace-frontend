'use client';

import { useState, type ChangeEvent } from 'react';
import type { z } from 'zod';

export function useLiveValidation<TField extends string>(
  schema: z.ZodType,
  initial: Record<TField, string>,
) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState<Partial<Record<TField, boolean>>>({});

  const result = schema.safeParse(values);
  const errors: Partial<Record<string, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const fieldName = String(issue.path[0] ?? '');
      errors[fieldName] ??= issue.message;
    }
  }

  function field(name: TField) {
    return {
      name,
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValues((current) => ({ ...current, [name]: value }));
        setTouched((current) => ({ ...current, [name]: true }));
      },
    };
  }

  function errorOf(name: TField): string | undefined {
    return touched[name] ? errors[name] : undefined;
  }

  return { values, field, errorOf };
}