// app/lumaspace/airdrop/page.tsx
"use client";

import React from "react";
import DashboardLayout from "@/components/lumaspace/DashboardLayout";
import AirdropEngine from "@/components/lumaspace/AirdropEngine";

export default function LumaSpaceAirdropPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            LumaSpace Airdrop
          </h1>
          <p className="text-sm text-muted-foreground">
            See if you&apos;re eligible for a LumaSpace credit airdrop and claim it
            directly into your wallet. This surface never throws and is safe to use
            in all environments.
          </p>
        </header>

        <section className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Eligibility is derived from your current LumaSpace aura and activity. The
            engine only calls internal APIs and does not expose any wallet keys.
          </p>

          <AirdropEngine debugTag="lumaspace-airdrop" autoCheck />
        </section>
      </div>
    </DashboardLayout>
  );
}
