'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '@/providers/socket-provider';
import type {
  ChatMessageView,
  ChatRoomHandlers,
  MessageFailedEvent,
  SendAck,
} from '@/types/chat.types';
import type { ChatMessage, SanctionNotice } from '@/types/messages.types';

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
  const { socket, connection } = useSocket();
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
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
    if (!socket) {
      return;
    }
    const markRead = () => {
      if (document.visibilityState === 'visible') {
        socket.emit('room:read', { roomId });
      }
    };
    const joinRoom = () => {
      socket.emit('room:join', { roomId });
      markRead();
    };
    const onNewMessage = (message: ChatMessage) => {
      if (message.roomId === roomId) {
        setMessages((list) => upsert(list, message));
        markRead();
      }
    };
    const onFailed = (event: MessageFailedEvent) => {
      if (event.roomId === roomId) {
        markFailed(event.clientMessageId, event.reason);
      }
    };
    const onSanctionApplied = (notice: SanctionNotice) => handlersRef.current.onSanctionApplied(notice);
    const onSanctionRevoked = () => handlersRef.current.onSanctionRevoked();

    socket.on('connect', joinRoom);
    socket.on('message:new', onNewMessage);
    socket.on('message:failed', onFailed);
    socket.on('sanction:applied', onSanctionApplied);
    socket.on('sanction:revoked', onSanctionRevoked);
    document.addEventListener('visibilitychange', markRead);
    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off('connect', joinRoom);
      socket.off('message:new', onNewMessage);
      socket.off('message:failed', onFailed);
      socket.off('sanction:applied', onSanctionApplied);
      socket.off('sanction:revoked', onSanctionRevoked);
      document.removeEventListener('visibilitychange', markRead);
      socket.emit('room:leave', { roomId });
    };
  }, [socket, roomId, markFailed]);

  const emitMessage = useCallback(
    (clientMessageId: string, body: string) => {
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
    [socket, roomId, markFailed],
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

  const prependOlder = useCallback((older: ChatMessage[]) => {
    setMessages((list) => {
      const known = new Set(list.map((message) => message.id));
      return [...older.filter((message) => !known.has(message.id)), ...list];
    });
  }, []);

  return { messages, connection, send, retry, prependOlder };
}