export type DependencyState = 'up' | 'down';

export interface SystemHealth {
  reachable: boolean;
  status: 'ok' | 'unavailable';
  checks: Record<string, DependencyState>;
  latencyMs: number;
}