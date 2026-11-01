//Tablonun üstündeki filtre düğmeleri, örneğin “Hepsi / Aktif / Askıda / Banlı”.
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface FilterTab {
  label: string;
  href: string;
  active: boolean;
}

export function FilterTabs({ tabs }: { tabs: FilterTab[] }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'rounded-full border px-3 py-1 text-sm',
            tab.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}