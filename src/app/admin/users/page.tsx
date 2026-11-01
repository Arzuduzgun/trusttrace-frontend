import { FilterTabs } from '@/components/filter-tabs';
import type { UserStatus } from '@/endpoints/auth/types';
import { listUsers } from '@/endpoints/users/queries';
import { UsersTable } from '@/features/users/users-table';

const STATUS_FILTERS: { label: string; value?: UserStatus }[] = [
  { label: 'Hepsi' },
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Askıda', value: 'SUSPENDED' },
  { label: 'Banlı', value: 'BANNED' },
];

function parseStatus(value: string | undefined): UserStatus | undefined {
  return value === 'ACTIVE' || value === 'SUSPENDED' || value === 'BANNED' ? value : undefined;
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const status = parseStatus((await searchParams).status);
  const users = await listUsers(status);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">Kullanıcılar</h1>
      <FilterTabs
        tabs={STATUS_FILTERS.map((filter) => ({
          label: filter.label,
          href: filter.value ? `/admin/users?status=${filter.value}` : '/admin/users',
          active: filter.value === status,
        }))}
      />
      <UsersTable users={users} />
    </div>
  );
}