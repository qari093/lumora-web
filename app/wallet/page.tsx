"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  getWalletActivationSummary,
  walletActivationSurfaces,
} from "@/src/core/founder-activation/walletActivation";

function WalletContent() {
  const params = useSearchParams();
  const stripeStatus = params ? params.get("stripe") : null;
  const summary = getWalletActivationSummary();

  useEffect(() => {
    if (stripeStatus !== "success") return;

    const timer = setTimeout(() => {
      window.location.reload();
    }, 2500);

    return () => clearTimeout(timer);
  }, [stripeStatus]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f18",
        color: "#fff",
        padding: "24px",
      }}
    >
      {stripeStatus === "success" ? (
        <div
          role="status"
          style={{
            marginBottom: "16px",
            border: "1px solid rgba(16,185,129,.35)",
            borderRadius: "12px",
            padding: "12px 16px",
          }}
        >
          Payment successful. Your wallet balance will refresh shortly.
        </div>
      ) : null}

      {stripeStatus === "cancel" ? (
        <div
          role="status"
          style={{
            marginBottom: "16px",
            border: "1px solid rgba(245,158,11,.35)",
            borderRadius: "12px",
            padding: "12px 16px",
          }}
        >
          Payment canceled. No wallet credits were applied.
        </div>
      ) : null}

      <h1>Wallet and Zen Economy are now visible founder review layers.</h1>

      <p>
        Founder gate active · Payments disabled · Zencoin bridge disabled ·
        Tester invites blocked
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {walletActivationSurfaces.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        Wallet Overview · Zen Economy · Transaction Ledger · Treasury View
      </div>

      <pre style={{ marginTop: "24px" }}>
        {JSON.stringify(summary, null, 2)}
      </pre>
    </main>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#0b0f18",
            color: "#fff",
            padding: "24px",
          }}
        >
          Loading wallet…
        </main>
      }
    >
      <WalletContent />
    </Suspense>
  );
}
