//Admin sayfalarının üstündeki menü: Kullanıcılar ve İhlal defteri.
import Link from 'next/link';

const ADMIN_LINKS = [
  { href: '/admin/users', label: 'Kullanıcılar' },
  { href: '/admin/moderation-events', label: 'İhlal defteri' },
  { href: '/admin/rules', label: 'Yasaklı kelimeler' },
  { href: '/admin/conversations', label: 'Konuşmalar' },
];

export function AdminNav() {
  return (
    <nav className="flex gap-4 border-b px-4 py-2 text-sm">
      {ADMIN_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}