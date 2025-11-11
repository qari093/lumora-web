// FILE: app/lumaspace/shadow/page.tsx
"use client";

import DashboardLayout from "@/components/lumaspace/DashboardLayout";
import ShadowTradingPanel from "@/components/lumaspace/ShadowTradingPanel";

export default function ShadowPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <header>
          <h1 className="text-lg font-semibold">Shadow Trading Surface</h1>
          <p className="text-sm text-muted-foreground">
            Monitor shadow positions, stealth liquidity, and market
            synchronization in real time.
          </p>
        </header>

        <ShadowTradingPanel debugTag="lumaspace-shadow" />
      </div>
    </DashboardLayout>
  );
}
