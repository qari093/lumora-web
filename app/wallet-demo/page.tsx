// app/wallet-demo/page.tsx
"use client";
import React from "react";

export default function WalletDemo() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const userId = "demo-user-123";

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Arial" }}>
      <h1 style={{ fontWeight: 800, marginBottom: 12 }}>Wallet (demo)</h1>
      <p>User: <code>{userId}</code></p>
      <button onClick={refresh} disabled={loading} style={{ padding: "8px 14px", borderRadius: 8 }}>
        {loading ? "Refreshing…" : "Refresh balance"}
      </button>
      <pre style={{ marginTop: 16, background: "#f6f6f8", padding: 12, borderRadius: 8, overflowX: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      <p style={{marginTop:12}}>Tip: complete a Stripe test checkout, then press “Refresh balance”.</p>
    </main>
  );
}
