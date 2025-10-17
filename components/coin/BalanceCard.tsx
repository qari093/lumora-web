"use client";
import { useEffect, useState } from "react";

export default function BalanceCard({ userId }: { userId: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await fetch(`/api/coin/balance?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    setBalance(data.balance ?? 0);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [userId]);

  return (
    <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}>
      <div style={{fontSize:14, color:"#6b7280"}}>Balance</div>
      <div style={{fontSize:28, fontWeight:700}}>
        {loading ? "…" : balance}
      </div>
      <button onClick={refresh} style={{marginTop:8, padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
        Refresh
      </button>
    </div>
  );
}
