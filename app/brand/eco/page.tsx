// app/brand/eco/page.tsx
// Safe placeholder brand eco impact page — no DB calls during build.
export const dynamic = "force-dynamic";

import React from "react";

export default function BrandEcoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Eco Impact</h1>
        <p className="text-sm text-muted-foreground">
          The detailed eco impact dashboard is temporarily disabled while the sustainability engine is being upgraded.
        </p>
      </header>

      <section className="rounded-xl border border-border/60 bg-background/60 p-6 shadow-sm space-y-2">
        <p className="text-sm text-muted-foreground">
          No live footprint or offset data is loaded on this page in the current build. This keeps production builds safe while
          Prisma models, eco calculations, and reporting pipelines are being finalized.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Admin note: original implementation is backed up next to this file (.bak_2_44) for future restoration.
        </p>
      </section>
    </main>
  );
}
