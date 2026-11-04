'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getWsTicketAction } from '@/endpoints/auth/actions';
import type { ChatMessage, SanctionNotice } from '@/types/messages.types';
import { WS_URL } from '@/lib/public-env';
import { ChatMessageView, ChatRoomHandlers, ConnectionState, MessageFailedEvent, SendAck } from '@/types/chat.types';

const ACK_TIMEOUT_MS = 5000;


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

  const markFailed = useCallback((clientMessageId: string, errorMessage: string) => {
    setMessages((list) =>
      list.map((message) =>
        message.clientMessageId === clientMessageId
          ? { ...message, status: 'FAILED', errorMessage }
          : message,
      ),
    );
  }, []);
  
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
    socket.on('message:failed', (event: MessageFailedEvent) => {
      if (event.roomId === roomId) {
        markFailed(event.clientMessageId, event.reason);
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
  }, [roomId, markFailed]);

  const emitMessage = useCallback(
    (clientMessageId: string, body: string) => {
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
    [roomId, markFailed],
  );

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
      emitMessage(clientMessageId, body);
    },
    [roomId, currentUser.id, currentUser.displayName, emitMessage],
  );

  const retry = useCallback(
    (message: ChatMessageView) => {
      setMessages((list) =>
        list.map((item) =>
          item.clientMessageId === message.clientMessageId
            ? { ...item, status: 'PENDING', errorMessage: undefined }
            : item,
        ),
      );
      emitMessage(message.clientMessageId, message.body);
    },
    [emitMessage],
  );

  return { messages, connection, send, retry };
}