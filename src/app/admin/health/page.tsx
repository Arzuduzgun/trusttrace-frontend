import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getSystemHealth } from '@/endpoints/health/queries';
import { cn } from '@/lib/utils';

function StatusCard({ title, up, detail }: { title: string; up: boolean; detail: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <span className={cn('size-2.5 rounded-full', up ? 'bg-green-500' : 'bg-red-500')} />
        <h2 className="font-medium">{title}</h2>
      </div>
      <p className={cn('mt-2 text-sm', up ? 'text-green-700' : 'text-red-700')}>
        {up ? 'Çalışıyor' : 'Sorun var'}
      </p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export default async function AdminHealthPage() {
  const health = await getSystemHealth();
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sistem sağlığı</h1>
        <Link href="/admin/health" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
          Yenile
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          title="API"
          up={health.reachable}
          detail={health.reachable ? `Cevap süresi: ${health.latencyMs} ms` : 'Backend\'e ulaşılamıyor'}
        />
        <StatusCard title="Veritabanı (PostgreSQL)" up={health.checks['database'] === 'up'} detail="/health/ready" />
        <StatusCard title="Redis" up={health.checks['redis'] === 'up'} detail="/health/ready" />
      </div>
    </div>
  );
}