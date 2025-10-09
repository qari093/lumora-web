"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function SubscribePage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");

  const checkout = async (priceEnv: "monthly"|"yearly") => {
    setLoading(true); setError(null);
    try {
      const priceId = priceEnv === "monthly" ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: priceId || undefined, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");
      if (data.url) { window.location.href = data.url; return; }
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 10 }}>🔒 Lumora Live — Subscribe</h1>
      <p style={{ marginBottom: 16 }}>Access live rooms (A/V + screenshare). Choose a plan:</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={card()}>
          <h3>Monthly</h3>
          <p>Cancel anytime.</p>
          <button disabled={loading} onClick={() => checkout("monthly")} style={btn()}>
            {loading ? "Processing…" : "Subscribe Monthly"}
          </button>
        </div>
        <div style={card()}>
          <h3>Yearly</h3>
          <p>2 months free.</p>
          <button disabled={loading} onClick={() => checkout("yearly")} style={btn()}>
            {loading ? "Processing…" : "Subscribe Yearly"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label>Email (optional for receipt): </label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
               style={{ padding:"8px 10px", border:"1px solid #333", borderRadius:8, marginLeft:8 }} />
      </div>

      {error && <div style={{ marginTop:12, color:"#ef4444" }}>{error}</div>}

      <div style={{ marginTop: 18 }}>
        <a href="/live/main-room">Try demo room (if access granted)</a>
      </div>
    </div>
  );
}

function btn(): React.CSSProperties {
  return { padding:"10px 14px", borderRadius:10, border:"1px solid #333", background:"linear-gradient(180deg,#22c55e,#16a34a)", color:"#0b0f12", fontWeight:800, cursor:"pointer" };
}
function card(): React.CSSProperties {
  return { border:"1px solid #333", borderRadius:10, padding:14, background:"#0b0f12", color:"#e5e7eb" };
}
