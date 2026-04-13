"use client";

import { useEffect, useState } from "react";

type WalletSummary = {
  status: string;
  balance: number;
  rewardsReady: boolean;
  recentTransactions: number;
};

export default function WalletLiveClient() {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/wallet/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("wallet_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("wallet_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-wallet-live="ready">
      {error ? <div data-wallet-error={error}>Wallet unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-wallet-status>Status: {summary.status}</div>
          <div data-wallet-balance>Balance: {summary.balance}</div>
          <div data-wallet-rewards-ready>Rewards Ready: {String(summary.rewardsReady)}</div>
          <div data-wallet-recent-transactions>Recent Transactions: {summary.recentTransactions}</div>
        </div>
      ) : null}
    </section>
  );
}
