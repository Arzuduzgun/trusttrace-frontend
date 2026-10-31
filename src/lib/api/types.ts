export interface ApiErrorBody {
  code: string;
  message: string;
  details?: { field: string; constraints: string[] }[];
  requestId?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, string | number | boolean | null>;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorBody;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;