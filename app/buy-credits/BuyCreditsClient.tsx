// app/buy-credits/page.tsx
"use client";
import React, { useState } from "react";

export default function BuyCreditsPage() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<string | null>(null);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const s = url.searchParams.get("state");
    if (s) setState(s);
  }, []);

  async function checkout(credits: number) {
    setLoading(true);
    try {
      // TODO: plug in real user id from auth/session
      const userId = "demo-user-123";
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits }),
      });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "Failed to create session");
      window.location.href = json.url;
    } catch (e: any) {
      alert(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Arial" }}>
      <h1 style={{ fontWeight: 800, marginBottom: 12 }}>Buy Lumora Credits</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>Choose a pack — you’ll be redirected to Stripe Checkout.</p>

      {state === "success" && <p style={{ color: "green" }}>Payment successful! Credits will appear shortly.</p>}
      {state === "cancel" && <p style={{ color: "tomato" }}>Payment canceled.</p>}

      <div style={{ display: "flex", gap: 12 }}>
        {[100, 250, 500].map(n => (
          <button key={n}
            onClick={() => checkout(n)}
            disabled={loading}
            style={{ padding: "10px 14px", borderRadius: 10, fontWeight: 700 }}>
            {n} credits
          </button>
        ))}
      </div>
    </main>
  );
}
