export type MessageStatus = 'DELIVERED' | 'FLAGGED' | 'BLOCKED';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  body: string;
  status: MessageStatus;
  clientMessageId: string;
  createdAt: string;
}

export interface SanctionNotice {
  sanction: 'SUSPEND' | 'BAN';
  reason: string;
  suspendedUntil: string | null;
}