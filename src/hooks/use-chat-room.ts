/*Konuşma ekranını yönetir. Socket bağlantısını yönetir, mesaj listesini tutar ve 
mesaj gönderir.*/
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getWsTicketAction } from '@/endpoints/auth/actions';
import type { ChatMessage, MessageStatus, SanctionNotice } from '@/endpoints/messages/types';
import { WS_URL } from '@/lib/public-env';

/*Ekrandaki mesaj. Sunucudan gelen durumlara ek olarak iki yerel durum alabiliyor:
PENDING: gönderiliyor, henüz onay gelmedi
FAILED: gönderilemedi*/
export interface ChatMessageView extends Omit<ChatMessage, 'status'> {
  status: MessageStatus | 'PENDING' | 'FAILED';
  errorMessage?: string;
}

//Bağlantının durumu: bağlanıyor, bağlı, koptu.
export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

interface ChatRoomHandlers {
  onSanctionApplied: (notice: SanctionNotice) => void;
  onSanctionRevoked: () => void;
}

type SendAck =
  | { ok: true; data: ChatMessage }
  | { ok: false; error: { code: string; message: string } };

const ACK_TIMEOUT_MS = 5000;

//Mesaj listede yoksa sona ekler, varsa yerine koyar.
function upsert(list: ChatMessageView[], incoming: ChatMessageView): ChatMessageView[] {
  const index = list.findIndex(
    (message) =>
      message.clientMessageId === incoming.clientMessageId && message.senderId === incoming.senderId,
  );
  if (index === -1) {
    return [...list, incoming];
  }
  return list.map((message, i) => (i === index ? incoming : message));
}

export function useChatRoom(
  roomId: string,
  currentUser: { id: string; displayName: string },
  initialMessages: ChatMessage[],
  handlers: ChatRoomHandlers,
) {
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
  const [connection, setConnection] = useState<ConnectionState>('connecting');
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ['websocket'],
      auth: (callback) => {
        getWsTicketAction()
          .then((ticket) => callback({ ticket }))
          .catch(() => callback({}));
      },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnection('connected');
      socket.emit('room:join', { roomId });
    });
    socket.on('disconnect', () => setConnection('disconnected'));
    socket.on('connect_error', () => setConnection('disconnected'));
    socket.on('message:new', (message: ChatMessage) => {
      if (message.roomId === roomId) {
        setMessages((list) => upsert(list, message));
      }
    });
    socket.on('sanction:applied', (notice: SanctionNotice) => {
      handlersRef.current.onSanctionApplied(notice);
    });
    socket.on('sanction:revoked', () => {
      handlersRef.current.onSanctionRevoked();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const markFailed = useCallback((clientMessageId: string, errorMessage: string) => {
    setMessages((list) =>
      list.map((message) =>
        message.clientMessageId === clientMessageId
          ? { ...message, status: 'FAILED', errorMessage }
          : message,
      ),
    );
  }, []);

  const send = useCallback(
    (body: string) => {
      const clientMessageId = crypto.randomUUID();
      setMessages((list) => [
        ...list,
        {
          id: clientMessageId,
          roomId,
          senderId: currentUser.id,
          senderName: currentUser.displayName,
          body,
          clientMessageId,
          createdAt: new Date().toISOString(),
          status: 'PENDING',
        },
      ]);
      const socket = socketRef.current;
      if (!socket?.connected) {
        markFailed(clientMessageId, 'Bağlantı yok.');
        return;
      }
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emit('message:send', { roomId, body, clientMessageId }, (error: Error | null, ack: SendAck) => {
          if (error) {
            markFailed(clientMessageId, 'Sunucu cevap vermedi.');
            return;
          }
          if (ack.ok) {
            setMessages((list) => upsert(list, ack.data));
          } else {
            markFailed(clientMessageId, ack.error.message);
          }
        });
    },
    [roomId, currentUser.id, currentUser.displayName, markFailed],
  );

  return { messages, connection, send };
}