import { ChatMessage, MessageStatus, SanctionNotice } from "./messages.types";

export interface ChatMessageView extends Omit<ChatMessage, 'status'> {
  status: MessageStatus | 'PENDING' | 'FAILED';
  errorMessage?: string;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export interface ChatRoomHandlers {
  onSanctionApplied: (notice: SanctionNotice) => void;
  onSanctionRevoked: () => void;
}

export type SendAck =
  | { ok: true; data: ChatMessage }
  | { ok: false; error: { code: string; message: string } };