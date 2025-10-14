"use client";
import { useEffect, useState } from "react";

export default function BalanceCard({ userId }: { userId: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/coin/balance?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
      const data = await res.json();
      setBalance(data.balance ?? 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [userId]);

  return (
    <div style={{padding:16,border:"1px solid #333",borderRadius:8}}>
      <div style={{fontSize:18,fontWeight:600,marginBottom:8}}>Balance</div>
      <div style={{fontSize:32,fontWeight:700}}>{balance ?? "—"}</div>
      <button onClick={load} disabled={loading} style={{marginTop:12,padding:"6px 10px"}}>
        {loading ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
