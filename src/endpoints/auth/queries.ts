import 'server-only';
import { ApiError } from '@/lib/api/api-error';
import { serverFetch } from '@/lib/api/server-fetch';
import type { InvitePreview } from '@/types/api-schemas';

export async function getInvitePreview(token: string): Promise<InvitePreview | null> {
  try {
    return await serverFetch<InvitePreview>(`/auth/invites/${encodeURIComponent(token)}`);
  } catch (error) {
    if (error instanceof ApiError) {
      return null;
    }
    throw error;
  }
}
