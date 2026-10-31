//Mesajın ve ceza bildiriminin frontend’deki şekli.
export type MessageStatus = 'DELIVERED' | 'FLAGGED' | 'BLOCKED';

//Backend’in gönderdiği mesaj. Hem REST’ten hem socket’ten aynı şekilde geliyor.
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

//Admin ceza verdiğinde socket’ten gelen bildirim.
export interface SanctionNotice {
  sanction: 'SUSPEND' | 'BAN';
  reason: string;
  suspendedUntil: string | null;
}