"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BalanceProvider } from "@/components/lumora/BalanceContext";

// child widgets کو client-only بنائیں
const StakingDashboard = dynamic(
  () => import("@/components/lumora/StakingDashboard"),
  { ssr: false }
);
const ReferralManager = dynamic(
  () => import("@/components/lumora/ReferralManager"),
  { ssr: false }
);

// NoSSR: سرور پر سادہ placeholder، اصل UI صرف ماؤنٹ کے بعد
function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        style={{ padding: 20, background: "#000", color: "#999", minHeight: "100vh" }}
      >
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}

function AutoRenderer() {
  const steps = [
    { id: 1, label: "Init Wallet",   status: "done" as const },
    { id: 2, label: "Stake Engine",  status: "done" as const },
    { id: 3, label: "Referral Link", status: "active" as const },
    { id: 4, label: "Economy Sync",  status: "pending" as const },
  ];
  const txs = [
    { id: "t1", time: "12:00", type: "Stake",    amount: "+20" },
    { id: "t2", time: "12:05", type: "Reward",   amount: "+5"  },
    { id: "t3", time: "12:12", type: "Withdraw", amount: "-10" },
  ];

  const pill = (s: "done" | "active" | "pending"): React.CSSProperties => ({
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    background: s === "done" ? "green" : s === "active" ? "orange" : "#444",
    color: "#fff",
  });

  return (
    <div
      suppressHydrationWarning
      style={{ padding: 20, background: "#000", color: "#fff", minHeight: "100vh" }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>⚡ Zencoin Auto Test</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#111827",
              padding: "10px 12px",
              borderRadius: 8,
            }}
          >
            <div>{s.id}. {s.label}</div>
            <span style={pill(s.status)}>{s.status.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
        <StakingDashboard />
        <ReferralManager />
      </div>

      <div style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>📜 Recent Transactions</h2>
        {txs.slice(0, 12).map((t) => (
          <div key={t.id} style={{ fontSize: 14, opacity: 0.9 }}>
            [{t.time}] {t.type} {t.amount}⚡
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <NoSSR>
      <BalanceProvider>
        <AutoRenderer />
      </BalanceProvider>
    </NoSSR>
  );
}
