"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Balance = { ok: true; userId: string; credits: number };
type LedgerRow = { id: string; direction: string; amount: number; source: string; createdAt: string };
type History = { ok: true; items: LedgerRow[] };

export default function WalletPage() {
  const params = useSearchParams();
  const userId = "demo_user"; // replace with auth-bound user id

// LUMORA_AUTH_TODO_WALLET_USERID: Wallet must use session/auth userId before shipping.
if (process.env.NODE_ENV === "production") {
  throw new Error("wallet_requires_auth_userId");
}

  const stripeStatus = params.get("stripe"); // success | cancel | null

  const [balance, setBalance] = useState<number>(0);
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const b = await fetch(`/api/wallet/balance?userId=${userId}`).then(r => r.json()) as Balance;
    const h = await fetch(`/api/wallet/history?userId=${userId}&limit=20`).then(r => r.json()) as History;
    if (b?.ok) setBalance(b.credits);
    if (h?.ok) setRows(h.items || []);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, []);

  // Auto-refresh shortly after Stripe success to reflect webhook credit
  useEffect(() => {
    if (stripeStatus === "success") {
      const t = setTimeout(() => {
        load().catch(() => {});
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [stripeStatus]);

  return (
    <div className="p-6 space-y-4">
      {stripeStatus === "success" && (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-green-800">
          Payment successful. Credits will appear shortly.
        </div>
      )}
      {stripeStatus === "cancel" && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-yellow-800">
          Payment canceled. No charges were made.
        </div>
      )}

      {loading ? (
        <div>Loading wallet…</div>
      ) : (
        <>
          <div className="text-xl font-semibold">Credits: {balance}</div>
          <div>
            <h2 className="font-medium mb-2">History</h2>
            <ul className="space-y-1 text-sm">
              {rows.map(r => (
                <li key={r.id}>
                  [{new Date(r.createdAt).toLocaleString()}] {r.direction} {r.amount} ({r.source})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
