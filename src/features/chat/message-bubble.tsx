import { cn } from '@/lib/utils';
import type { ChatMessageView } from '@/types/chat.types';

const STATUS_LABELS: Partial<Record<ChatMessageView['status'], { text: string; className: string }>> = {
  BLOCKED: { text: 'Engellendi — kimseye iletilmedi', className: 'bg-red-100 text-red-800' },
  FLAGGED: { text: 'İşaretlendi', className: 'bg-amber-100 text-amber-800' },
  PENDING: { text: 'Gönderiliyor…', className: 'text-muted-foreground' },
  FAILED: { text: 'Gönderilemedi', className: 'bg-red-100 text-red-800' },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({
  message,
  isOwn,
  onRetry,
  seen = false,
}: {
  message: ChatMessageView;
  isOwn: boolean;
  onRetry?: () => void;
  seen?: boolean;
}) {
  const label = STATUS_LABELS[message.status];
  return (
    <div className={cn('flex max-w-[75%] flex-col gap-1', isOwn ? 'items-end self-end' : 'items-start self-start')}>
      {!isOwn && <span className="text-xs text-muted-foreground">{message.senderName}</span>}
      <div
        className={cn(
          'whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm',
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted',
          message.status === 'BLOCKED' && 'line-through opacity-60',
        )}
      >
        {message.body}
      </div>
      <span className="text-[11px] text-muted-foreground" suppressHydrationWarning>
        {formatTime(message.createdAt)}
        {label && (
          <span className={cn('ml-2 rounded px-1.5 py-0.5', label.className)}>
            {label.text}
            {message.errorMessage ? `: ${message.errorMessage}` : ''}
          </span>
        )}
        {isOwn && message.status === 'FAILED' && onRetry && (
          <button type="button" onClick={onRetry} className="ml-2 underline">
            Tekrar dene
          </button>
        )}
        {seen && <span className="ml-2 text-blue-600">✓✓ Görüldü</span>}
      </span>
    </div>
  );
}