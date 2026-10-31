//Konuşma ekranının tamamı: üst bar, mesaj listesi ve yazma kutusu. Hook’tan gelen veriyi gösteriyor.
'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, SanctionNotice } from '@/endpoints/messages/types';
import type { Room } from '@/endpoints/rooms/types';
import { useChatRoom, type ConnectionState } from '@/hooks/use-chat-room';
import { cn } from '@/lib/utils';
import { Composer } from './composer';
import { MessageBubble } from './message-bubble';
import { forceSignOutAction } from '@/endpoints/auth/actions';

const CONNECTION_LABELS: Record<ConnectionState, { text: string; className: string }> = {
  connecting: { text: 'Bağlanıyor…', className: 'bg-muted text-muted-foreground' },
  connected: { text: 'Bağlı', className: 'bg-green-100 text-green-800' },
  disconnected: { text: 'Bağlantı koptu', className: 'bg-red-100 text-red-800' },
};

interface ChatWindowProps {
  room: Room;
  currentUser: { id: string; displayName: string };
  initialMessages: ChatMessage[];
}

export function ChatWindow({ room, currentUser, initialMessages }: ChatWindowProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, connection, send } = useChatRoom(room.id, currentUser, initialMessages, {
    onSanctionApplied: (sanction: SanctionNotice) => {
      if (sanction.sanction === 'BAN') {
            void forceSignOutAction('AUTH_ACCOUNT_BANNED');
        return;
      }
      setNotice(`Hesabınız askıya alındı. Gerekçe: ${sanction.reason}`);
    },
    onSanctionRevoked: () => setNotice(null),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const connectionLabel = CONNECTION_LABELS[connection];

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="font-semibold">{room.name}</h1>
        <span className={cn('rounded px-2 py-0.5 text-xs', connectionLabel.className)}>
          {connectionLabel.text}
        </span>
      </div>
      {notice && <p className="bg-amber-100 px-4 py-2 text-sm text-amber-900">{notice}</p>}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="m-auto text-sm text-muted-foreground">Henüz mesaj yok. İlk mesajı sen yaz.</p>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.clientMessageId}
            message={message}
            isOwn={message.senderId === currentUser.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <Composer onSend={send} disabled={connection !== 'connected'} />
    </div>
  );
}