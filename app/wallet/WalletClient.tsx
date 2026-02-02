"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function WalletClient() {
  const sp = useSearchParams();
  const stripe = sp.get("stripe"); // expected: success | cancel | null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {stripe === "success" ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Payment successful. Credits will appear shortly.
        </div>
      ) : stripe === "cancel" ? (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Payment canceled.
        </div>
      ) : null}

      <h1 className="text-xl font-semibold">Wallet</h1>
      <p className="mt-2 text-sm opacity-80">
        Wallet UI is launch-safe. Auth enforcement and permissions are handled by the access/safety phase.
      </p>
    </div>
  );
}
