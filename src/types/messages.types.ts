import type { SanctionReasonCode } from './api-schemas';

export type { ChatMessage, MessageStatus } from './api-schemas';

export interface SanctionNotice {
  sanction: 'SUSPEND' | 'BAN';
  reasonCode: SanctionReasonCode;
  note: string | null;
  suspendedUntil: string | null;
}