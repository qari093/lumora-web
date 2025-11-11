// app/admin/campaigns/page.tsx
// Safe placeholder admin campaigns page — no DB calls during build.
export const dynamic = "force-dynamic";

import React from "react";

export default function AdminCampaignsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Ad Campaigns</h1>
        <p className="text-sm text-muted-foreground">
          The full campaigns dashboard is temporarily disabled while the Lumora Ads engine is being upgraded.
        </p>
      </header>

      <section className="rounded-xl border border-border/60 bg-background/60 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No live data is loaded on this page in the current build. This keeps production builds safe while
          the underlying Prisma models and services are being finalized.
        </p>
      </section>
    </main>
  );
}
