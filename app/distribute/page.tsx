// app/distribute/page.tsx
// Safe placeholder distribute page — no DB calls during build.
export const dynamic = "force-dynamic";

import React from "react";

export default function DistributePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Distribute on Lumora</h1>
        <p className="text-sm text-muted-foreground">
          The advanced multi-channel distribution dashboard is temporarily disabled while creator tools are being upgraded.
        </p>
      </header>

      <section className="rounded-xl border border-border/60 bg-background/60 p-6 shadow-sm space-y-2">
        <p className="text-sm text-muted-foreground">
          No live catalog, campaigns, or partner data is loaded on this page in the current build. This keeps production builds safe while
          Prisma models and distribution flows are being finalized.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Admin note: original implementation is backed up next to this file (.bak_2_45) for future restoration.
        </p>
      </section>
    </main>
  );
}
