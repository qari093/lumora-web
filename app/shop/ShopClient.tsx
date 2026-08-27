"use client";

import { useState } from "react";

export default function ShopPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function createSession() {
    try {
      setBusy(true);
      setMsg(null);

      const res = await fetch("/api/shop/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setMsg(data?.error || "Checkout is temporarily unavailable.");
        return;
      }

      if (typeof data.url === "string" && data.url) {
        window.location.assign(data.url);
        return;
      }

      setMsg("Checkout could not be started.");
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      data-shop-production-state="session-bound"
      style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>ZenShop</h1>

      <p style={{ opacity: 0.8 }}>
        Purchase ZenCoin through Lumora&apos;s authenticated Stripe checkout.
      </p>

      <p style={{ marginTop: 8, opacity: 0.7, fontSize: 13 }}>
        Your Lumora account identity and checkout product are resolved securely
        by the server. They cannot be changed from this page.
      </p>

      <button
        type="button"
        onClick={createSession}
        disabled={busy}
        style={{
          marginTop: 20,
          padding: "10px 14px",
          background: "#0ea5e9",
          border: "1px solid #0891b2",
          color: "#fff",
          cursor: busy ? "not-allowed" : "pointer",
          minWidth: 180,
        }}
      >
        {busy ? "Opening checkout…" : "Buy ZenCoin"}
      </button>

      {msg ? (
        <div role="status" style={{ marginTop: 12, opacity: 0.85 }}>
          {msg}
        </div>
      ) : null}
    </main>
  );
}
