'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/endpoints/notifications/actions';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useSocket } from '@/providers/socket-provider';
import type { AppNotification } from '@/types/notification.types';
import { describeNotification } from './describe-notification';

export function NotificationBell({ initial }: { initial: AppNotification[] }) {
  const { socket } = useSocket();
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const unreadCount = items.filter((item) => item.readAt === null).length;

  useEffect(() => {
    if (!socket) {
      return;
    }
    const onNew = (notification: AppNotification) => {
      setItems((list) => [notification, ...list]);
      router.refresh();
    };
    socket.on('notification:new', onNew);
    return () => {
      socket.off('notification:new', onNew);
    };
  }, [socket, router]);

  function openNotification(notification: AppNotification) {
    const now = new Date().toISOString();
    setItems((list) =>
      list.map((item) => (item.id === notification.id ? { ...item, readAt: item.readAt ?? now } : item)),
    );
    setOpen(false);
    void markNotificationReadAction(notification.id);
    if (notification.roomId) {
      router.push(`/agent/rooms/${notification.roomId}`);
    }
  }

  function markAll() {
    const now = new Date().toISOString();
    setItems((list) => list.map((item) => ({ ...item, readAt: item.readAt ?? now })));
    void markAllNotificationsReadAction();
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bildirimler"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell />
      </Button>
      {unreadCount > 0 && (
        <span className="pointer-events-none absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="font-medium">Bildirimler</span>
            {unreadCount > 0 && (
              <button type="button" onClick={markAll} className="text-xs underline">
                Tümünü okundu say
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Bildirim yok.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-muted',
                      notification.readAt === null && 'bg-muted/50 font-medium',
                    )}
                  >
                    <div>{describeNotification(notification)}</div>
                    <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {formatDateTime(notification.createdAt)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}