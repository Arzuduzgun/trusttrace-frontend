//Defter tablosu. Sütunlar: sıra no, zaman, tür, kullanıcı, işlemi yapan, detay, işlem.
import type { ModerationEvent, ModerationEventType } from '@/endpoints/moderation/types';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { describeEvent } from './describe-event';
import { RevokeForm } from './revoke-form';
import Link from 'next/dist/client/link';

const TYPE_LABELS: Record<ModerationEventType, { text: string; className: string }> = {
  VIOLATION_DETECTED: { text: 'İhlal', className: 'bg-red-100 text-red-800' },
  SANCTION_IMPOSED: { text: 'Ceza', className: 'bg-amber-100 text-amber-900' },
  SANCTION_REVOKED: { text: 'Ceza kaldırıldı', className: 'bg-green-100 text-green-800' },
};

interface ModerationEventsTableProps {
  events: ModerationEvent[];
  names: Map<string, string>;
}

export function ModerationEventsTable({ events, names }: ModerationEventsTableProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">Bu filtrede kayıt yok.</p>;
  }
  const revokedIds = new Set(
    events.map((event) => event.refersToEventId).filter((id): id is string => id !== null),
  );
  const nameOf = (id: string): string => names.get(id) ?? id.slice(0, 8);

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Zaman</th>
            <th className="p-2">Tür</th>
            <th className="p-2">Kullanıcı</th>
            <th className="p-2">Yapan</th>
            <th className="p-2">Detay</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const label = TYPE_LABELS[event.eventType];
            const canRevoke = event.eventType === 'SANCTION_IMPOSED' && !revokedIds.has(event.id);
            return (
              <tr key={event.id} className="border-t align-top">
                <td className="p-2 text-muted-foreground">{event.seq}</td>
                <td className="whitespace-nowrap p-2">{formatDateTime(event.occurredAt)}</td>
                <td className="p-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-xs', label.className)}>{label.text}</span>
                </td>
                <td className="p-2">{nameOf(event.subjectUserId)}</td>
                <td className="p-2">
                  {event.actorType === 'SYSTEM' || !event.actorId ? 'Sistem' : nameOf(event.actorId)}
                </td>
                <td className="p-2">
                  <div>{describeEvent(event)}</div>
                  {event.roomId && (
                    <Link href={`/admin/conversations/${event.roomId}`} className="text-xs underline">
                      konuşmada gör
                    </Link>
                  )}
                </td>
                <td className="p-2">
                  {canRevoke && <RevokeForm userId={event.subjectUserId} eventId={event.id} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}