// FILE: app/lumaspace/trading/page.tsx
"use client";

import DashboardLayout from "@/components/lumaspace/DashboardLayout";
import ShadowTradingPanel from "@/components/lumaspace/ShadowTradingPanel";

export default function LumaSpaceTradingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 p-6">
        <header>
          <h1 className="text-lg font-semibold">Trading Surface</h1>
          <p className="text-sm text-muted-foreground">
            Real-time trading analytics and shadow synchronization layer.
          </p>
        </header>

        <section>
          <ShadowTradingPanel debugTag="lumaspace-trading-surface" />
        </section>
      </div>
    </DashboardLayout>
  );
}