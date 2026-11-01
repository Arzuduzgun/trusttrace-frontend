//Bütün odaların listesi. Admin için GET /rooms bütün odaları döndürüyor.
import { FilterTabs } from '@/components/filter-tabs';
import { listMyRooms } from '@/endpoints/rooms/queries';
import type { RoomType } from '@/endpoints/rooms/types';
import { RoomList } from '@/features/chat/room-list';

const TYPE_FILTERS: { label: string; value?: RoomType }[] = [
  { label: 'Hepsi' },
  { label: 'Özel görüşmeler', value: 'DIRECT' },
  { label: 'Ürün odaları', value: 'PRODUCT' },
];

function parseType(value: string | undefined): RoomType | undefined {
  return value === 'DIRECT' || value === 'PRODUCT' ? value : undefined;
}

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const type = parseType((await searchParams).type);
  const rooms = await listMyRooms();
  const visibleRooms = type ? rooms.filter((room) => room.type === type) : rooms;

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">Tüm konuşmalar</h1>
      <FilterTabs
        tabs={TYPE_FILTERS.map((filter) => ({
          label: filter.label,
          href: filter.value ? `/admin/conversations?type=${filter.value}` : '/admin/conversations',
          active: filter.value === type,
        }))}
      />
      <RoomList rooms={visibleRooms} basePath="/admin/conversations" />
    </div>
  );
}