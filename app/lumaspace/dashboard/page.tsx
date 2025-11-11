// app/lumaspace/dashboard/page.tsx
"use client";

import React from "react";
import DashboardLayout from "@/components/lumaspace/DashboardLayout";
import LumaSpaceStateBanner from "@/app/_components/lumaspace/state-banner";

export default function LumaSpaceDashboardPage() {
  return (
    <DashboardLayout>
      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">LumaSpace Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Unified control center for your LumaSpace: memory, reflection, shadow, and eco-state.
          </p>
        </header>

        {/* Live state banner (wired to /api/lumaspace/state + /api/lumaspace/ping) */}
        <LumaSpaceStateBanner />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
            <h2 className="text-sm font-medium">Memory & Reflection</h2>
            <p className="text-xs text-muted-foreground">
              Jump into your Memory Palace and reflection sessions.
            </p>
          </article>

          <article className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
            <h2 className="text-sm font-medium">Shadow Analytics</h2>
            <p className="text-xs text-muted-foreground">
              Inspect shadow patterns, trading signals, and recent activity.
            </p>
          </article>

          <article className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
            <h2 className="text-sm font-medium">Eco & Energy</h2>
            <p className="text-xs text-muted-foreground">
              Monitor eco impact, energy storms, and harmony scores.
            </p>
          </article>
        </section>
      </div>
    </DashboardLayout>
  );
}
