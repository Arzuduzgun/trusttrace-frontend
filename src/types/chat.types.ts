import { ChatMessage, SanctionNotice } from "./messages.types";

export interface ChatMessageView extends ChatMessage {
  errorMessage?: string;
}

export interface MessageFailedEvent {
  roomId: string;
  clientMessageId: string;
  reason: string;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export interface ChatRoomHandlers {
  onSanctionApplied: (notice: SanctionNotice) => void;
  onSanctionRevoked: () => void;
}

export type SendAck =
  | { ok: true; data: ChatMessage }
  | { ok: false; error: { code: string; message: string } };