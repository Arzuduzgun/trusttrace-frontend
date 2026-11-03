export type { ChatMessage, MessageStatus } from './api-schemas';

export interface SanctionNotice {
  sanction: 'SUSPEND' | 'BAN';
  reason: string;
  suspendedUntil: string | null;
}