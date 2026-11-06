import type { ReactNode } from 'react';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-amber-50 to-emerald-50 p-4">
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-indigo-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="relative flex w-full justify-center">{children}</div>
    </main>
  );
}
