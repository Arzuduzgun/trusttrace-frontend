import 'server-only';
import { serverFetchWithMeta } from '@/lib/api/server-fetch';
import type { ChatMessage, MessagePage } from '../../types/messages.types';

const PAGE_SIZE = 20;

export async function getMessagePage(roomId: string, cursor?: string): Promise<MessagePage> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (cursor) {
    params.set('cursor', cursor);
  }
  const page = await serverFetchWithMeta<ChatMessage[]>(
    `/rooms/${encodeURIComponent(roomId)}/messages?${params.toString()}`,
  );
  const nextCursor = page.meta?.nextCursor;
  return { messages: page.data, nextCursor: typeof nextCursor === 'string' ? nextCursor : null };
}
