import Link from 'next/link';
import { FilterTabs } from '@/components/filter-tabs';
import { listModerationEvents } from '@/endpoints/moderation/queries';
import type { ModerationEventType } from '@/endpoints/moderation/types';
import { listUsers } from '@/endpoints/users/queries';
import { ModerationEventsTable } from '@/features/moderation/moderation-events-table';

const TYPE_FILTERS: { label: string; value?: ModerationEventType }[] = [
  { label: 'Hepsi' },
  { label: 'İhlaller', value: 'VIOLATION_DETECTED' },
  { label: 'Cezalar', value: 'SANCTION_IMPOSED' },
  { label: 'Kaldırılan cezalar', value: 'SANCTION_REVOKED' },
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseType(value: string | undefined): ModerationEventType | undefined {
  return TYPE_FILTERS.find((filter) => filter.value === value)?.value;
}

function buildHref(eventType?: ModerationEventType, userId?: string): string {
  const params = new URLSearchParams();
  if (eventType) {
    params.set('eventType', eventType);
  }
  if (userId) {
    params.set('userId', userId);
  }
  const query = params.toString();
  return query ? `/admin/moderation-events?${query}` : '/admin/moderation-events';
}

export default async function ModerationEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventType?: string; userId?: string }>;
}) {
  const query = await searchParams;
  const eventType = parseType(query.eventType);
  const userId = query.userId && UUID_PATTERN.test(query.userId) ? query.userId : undefined;
  const [events, users] = await Promise.all([listModerationEvents({ eventType, userId }), listUsers()]);
  const names = new Map(users.map((user) => [user.id, user.displayName]));

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">İhlal defteri</h1>
      {userId && (
        <p className="text-sm">
          Filtre: <strong>{names.get(userId) ?? userId}</strong> ·{' '}
          <Link href={buildHref(eventType)} className="underline">
            temizle
          </Link>
        </p>
      )}
      <FilterTabs
        tabs={TYPE_FILTERS.map((filter) => ({
          label: filter.label,
          href: buildHref(filter.value, userId),
          active: filter.value === eventType,
        }))}
      />
      <ModerationEventsTable events={events} names={names} />
    </div>
  );
}