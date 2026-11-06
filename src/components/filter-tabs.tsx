//Tablonun üstündeki filtre düğmeleri.
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FilterTab } from '@/types/ui.types';

export function FilterTabs({ tabs }: { tabs: FilterTab[] }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
            tab.active
              ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
              : 'border border-indigo-200 bg-card text-indigo-700 hover:bg-indigo-50',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}