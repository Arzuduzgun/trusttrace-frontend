//Backend’e giden tek kapı. Frontend’deki bütün istekler buradan geçecek.
import 'server-only';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { getAccessToken } from '../auth/cookies';
import { env } from '../env';
import { ApiError } from './api-error';
import type { ApiEnvelope } from './types';
import { connection } from 'next/server';

const SESSION_ENDED_CODES = new Set([
  'AUTH_TOKEN_MISSING',
  'AUTH_TOKEN_INVALID',
  'AUTH_TOKEN_REVOKED',
  'AUTH_ACCOUNT_BANNED',
]);

async function request(path: string, init: RequestInit): Promise<Response> {
  await connection();
  const accessToken = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set('X-Request-Id', randomUUID());
  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return fetch(`${env.API_BASE_URL}${path}`, { ...init, headers, cache: 'no-store' });
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response.json()) as ApiEnvelope<never>;
  if (body.success) {
    return new ApiError(response.status, { code: 'UNEXPECTED_RESPONSE', message: 'Beklenmeyen cevap.' });
  }
  return new ApiError(response.status, body.error);
}

function redirectIfSessionProblem(error: ApiError): void {
  if (error.code === 'AUTH_TOKEN_EXPIRED') {
    redirect('/auth/refresh');
  }
  if (SESSION_ENDED_CODES.has(error.code)) {
    redirect(`/auth/signout?reason=${error.code}`);
  }
}

export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await request(path, init);
  if (!response.ok) {
    const error = await toApiError(response);
    redirectIfSessionProblem(error);
    throw error;
  }
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!body.success) {
    throw new ApiError(response.status, body.error);
  }
  return body.data;
}

export async function serverFetchVoid(path: string, init: RequestInit = {}): Promise<void> {
  const response = await request(path, init);
  if (!response.ok) {
    const error = await toApiError(response);
    redirectIfSessionProblem(error);
    throw error;
  }
}