'use client';

import { Activity, Ban, MessagesSquare, Package, ScrollText, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TONES = {
  indigo: {
    idle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    active: 'from-indigo-600 to-violet-600 shadow-indigo-500/30',
  },
  amber: {
    idle: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
    active: 'from-amber-400 to-orange-500 shadow-amber-500/30',
  },
  rose: {
    idle: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
    active: 'from-rose-500 to-pink-500 shadow-rose-500/30',
  },
  emerald: {
    idle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    active: 'from-emerald-500 to-teal-500 shadow-emerald-500/30',
  },
  sky: {
    idle: 'bg-sky-50 text-sky-700 hover:bg-sky-100',
    active: 'from-sky-500 to-blue-600 shadow-sky-500/30',
  },
  violet: {
    idle: 'bg-violet-50 text-violet-700 hover:bg-violet-100',
    active: 'from-violet-500 to-fuchsia-500 shadow-violet-500/30',
  },
};

const ADMIN_LINKS = [
  { href: '/admin/users', label: 'Kullanıcılar', icon: Users, tone: TONES.indigo },
  { href: '/admin/moderation-events', label: 'İhlal defteri', icon: ScrollText, tone: TONES.amber },
  { href: '/admin/rules', label: 'Yasaklı kelimeler', icon: Ban, tone: TONES.rose },
  { href: '/admin/conversations', label: 'Konuşmalar', icon: MessagesSquare, tone: TONES.emerald },
  { href: '/admin/products', label: 'Ürünler', icon: Package, tone: TONES.sky },
  { href: '/admin/health', label: 'Sistem sağlığı', icon: Activity, tone: TONES.violet },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto border-b bg-linear-to-r from-indigo-50/80 via-amber-50/80 to-emerald-50/80 px-4 py-2.5 text-sm backdrop-blur">
      {ADMIN_LINKS.map(({ href, label, icon: Icon, tone }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap transition-all',
              isActive ? cn('bg-linear-to-r text-white shadow-md', tone.active) : tone.idle,
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
