import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const isLarge = size === 'lg';
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          'flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30',
          isLarge ? 'size-10' : 'size-8',
        )}
      >
        <ShieldCheck className={isLarge ? 'size-6' : 'size-5'} />
      </span>
      <span
        className={cn(
          'bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text font-bold tracking-tight text-transparent',
          isLarge ? 'text-2xl' : 'text-xl',
        )}
      >
        TrustTrace
      </span>
    </span>
  );
}
