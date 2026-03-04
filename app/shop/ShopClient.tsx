"use client";

import { useState } from "react";

const DEFAULT_PRICE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || process.env.STRIPE_PRICE_ID || "price_xxx";
const SUCCESS_URL = process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || "http://localhost:3000/shop?status=success";
const CANCEL_URL = process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || "http://localhost:3000/shop?status=cancel";

export default function ShopPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState("demo-user-1");
  const [priceId, setPriceId] = useState(DEFAULT_PRICE);

  async function createSession() {
    try {
      setBusy(true);
      setMsg(null);
      const res = await fetch("/api/shop/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, priceId }),
      });
      const data = await res.json();
      if (!data.ok) {
        setMsg(data.error || "failed to create session");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMsg("session created but no URL returned");
      }
    } catch (e: any) {
      setMsg(e?.message || "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{maxWidth:800, margin:"32px auto", padding:"0 16px"}}>
      <h1 style={{fontSize:24, fontWeight:700}}>ZenShop</h1>
      <p style={{opacity:.8}}>Buy ZenCoin with Stripe Checkout (test mode).</p>

      <div style={{display:"grid", gap:12, marginTop:16}}>
        <label style={{display:"grid", gap:6}}>
          <span>User ID</span>
          <input
            value={userId}
            onChange={(e)=>setUserId(e.target.value)}
            style={{padding:"8px 10px", background:"#111", border:"1px solid #333", color:"#fff"}}
          />
        </label>

        <label style={{display:"grid", gap:6}}>
          <span>Stripe Price ID</span>
          <input
            value={priceId}
            onChange={(e)=>setPriceId(e.target.value)}
            style={{padding:"8px 10px", background:"#111", border:"1px solid #333", color:"#fff"}}
          />
        </label>

        <button
          onClick={createSession}
          disabled={busy}
          style={{
            padding:"10px 14px",
            background:"#0ea5e9",
            border:"1px solid #0891b2",
            color:"#fff",
            cursor: busy ? "not-allowed" : "pointer",
            width: 200,
            marginTop: 8
          }}
        >
          {busy ? "Creating session…" : "Buy ZenCoin"}
        </button>

        {msg && <div style={{ color: "#f88", marginTop: 8 }}>{msg}</div>}

        <div style={{ marginTop: 16, opacity: 0.7, fontSize: 12 }}>
          <div>Success URL: <code>{SUCCESS_URL}</code></div>
          <div>Cancel URL: <code>{CANCEL_URL}</code></div>
        </div>
      </div>
    </div>
  );
}
