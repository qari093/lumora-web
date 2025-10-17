import React from "react";

export default function NewCampaignPage() {
  const [name, setName] = React.useState("My First Campaign");
  const [budget, setBudget] = React.useState<number>(50);
  const [radius, setRadius] = React.useState<number>(3);
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          daily_budget: budget,
          targeting_radius_miles: radius,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Failed to create campaign");
      setMsg(`Created: ${j.id}`);
    } catch (err: any) {
      setMsg("❌ " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={S.main}>
      <div style={S.card}>
        <h1 style={S.h1}>Create Campaign</h1>
        <p style={S.sub}>
          This posts to <code>/api/campaigns</code> and returns an id.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <label style={S.label}>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} style={S.input} />
          </label>

          <label style={S.label}>
            Daily Budget (EUR)
            <input
              type="number"
              min={1}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value || 0))}
              style={S.input}
            />
          </label>

          <label style={S.label}>
            Target Radius (miles)
            <input
              type="number"
              min={1}
              max={25}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value || 0))}
              style={S.input}
            />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={loading} style={S.btnPrimary}>
              {loading ? "Creating…" : "Create"}
            </button>
            <a href="/vendor/wallet" style={{ ...S.btnLink }}>
              ← Wallet
            </a>
          </div>

          {msg && <div style={{ marginTop: 6 }}>{msg}</div>}
        </form>
      </div>
    </main>
  );
}

const S: any = {
  main: { minHeight: "100vh", background: "#0a0c10", color: "#e5e7eb", padding: "24px" },
  card: {
    maxWidth: 720,
    margin: "0 auto",
    border: "1px solid #1f2937",
    borderRadius: 14,
    background: "#0f1319",
    padding: 18,
  },
  h1: { fontSize: 22, fontWeight: 900, margin: 0 },
  sub: { margin: "6px 0 14px", color: "#94a3b8" },
  label: { display: "grid", gap: 6, fontWeight: 700 },
  input: {
    background: "#0b0f12",
    border: "1px solid #222",
    borderRadius: 8,
    color: "#e5e7eb",
    padding: "10px 12px",
  },
  btnPrimary: {
    background: "linear-gradient(180deg,#22c55e,#16a34a)",
    border: "none",
    color: "#0b0f12",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
  },
  btnLink: {
    color: "#a7f3d0",
    textDecoration: "none",
    padding: "10px 12px",
    border: "1px solid #2b2f36",
    borderRadius: 10,
  },
};
