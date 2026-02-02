import React, { Suspense } from "react";
import WalletClient from "./WalletClient";

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>
      }
    >
      <WalletClient />
    </Suspense>
  );
}
