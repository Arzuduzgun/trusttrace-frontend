import type { ApiError } from './api-error';

const CODE_FIELD: Record<string, string> = {
  USER_EMAIL_ALREADY_EXISTS: 'email',
};

export function fieldErrorsFromApiError(error: ApiError): Record<string, string[]> {
  const field = CODE_FIELD[error.code];
  if (field) {
    return { [field]: [error.message] };
  }
  return Object.fromEntries((error.details ?? []).map((detail) => [detail.field, detail.constraints]));
}