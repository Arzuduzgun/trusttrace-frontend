import { FilterTabs } from '@/components/filter-tabs';
import { listMyRooms } from '@/endpoints/rooms/queries';
import { RoomList } from '@/features/chat/room-list';
import type { RoomType } from '@/types/room.types';

type ConversationFilter = RoomType | 'ESCALATED';

const FILTERS: { label: string; value?: ConversationFilter }[] = [
  { label: 'Hepsi' },
  { label: 'Özel görüşmeler', value: 'DIRECT' },
  { label: 'Ürün odaları', value: 'PRODUCT' },
  { label: 'Yöneticiye iletilenler', value: 'ESCALATED' },
];

function parseFilter(value: string | undefined): ConversationFilter | undefined {
  return FILTERS.find((filter) => filter.value === value)?.value;
}

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const filter = parseFilter((await searchParams).type);
  const rooms = await listMyRooms();
  const visibleRooms = !filter
    ? rooms
    : filter === 'ESCALATED'
      ? rooms.filter((room) => room.status === 'ESCALATED')
      : rooms.filter((room) => room.type === filter);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">Tüm konuşmalar</h1>
      <FilterTabs
        tabs={FILTERS.map((item) => ({
          label: item.label,
          href: item.value ? `/admin/conversations?type=${item.value}` : '/admin/conversations',
          active: item.value === filter,
        }))}
      />
      <RoomList rooms={visibleRooms} basePath="/admin/conversations" />
    </div>
  );
}