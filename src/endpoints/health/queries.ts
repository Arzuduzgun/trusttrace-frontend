import 'server-only';
import { env } from '@/lib/env';
import type { DependencyState, SystemHealth } from '@/types/health.types';

export async function getSystemHealth(): Promise<SystemHealth> {
  const startedAt = performance.now();
  const elapsed = () => Math.round(performance.now() - startedAt);
  try {
    const response = await fetch(new URL('/health/ready', env.API_BASE_URL), {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    const body = (await response.json()) as {
      status: 'ok' | 'unavailable';
      checks: Record<string, DependencyState>;
    };
    return { reachable: true, status: body.status, checks: body.checks, latencyMs: elapsed() };
  } catch {
    return { reachable: false, status: 'unavailable', checks: {}, latencyMs: elapsed() };
  }
}