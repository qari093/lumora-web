"use client";
import React from "react";

type Props = { email: string };

export default function ZENPreview({ email }: Props) {
  const [state, setState] = React.useState<null | {
    pulse: number;
    zenCoin: number;
    multiplier: number;
    blessings: number;
    burns: number;
    updatedAt: string;
  }>(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const u = `/api/lumaspace/zen/preview?email=${encodeURIComponent(email)}`;
      const r = await fetch(u, { cache: "no-store" });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "failed");
      setState(j.zen);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, [email]);

  const wrap: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "12px 14px",
    background: "rgba(255,255,255,.9)",
    display: "flex",
    alignItems: "center",
    gap: 12
  };
  const badge: React.CSSProperties = {
    borderRadius: 10,
    padding: "6px 10px",
    background: "#0b8",
    color: "#fff",
    fontWeight: 800
  };
  const row: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
  const kpi: React.CSSProperties = {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: "8px 10px",
    minWidth: 90,
    textAlign: "center",
    background: "#fff",
    fontWeight: 800
  };
  const btn: React.CSSProperties = {
    border: "1px solid #0b8",
    background: "#0b8",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 10px",
    fontWeight: 900,
    cursor: "pointer"
  };

  return (
    <div style={wrap}>
      <div style={{ fontWeight: 900 }}>Zen Preview</div>
      <div style={badge}>{email}</div>
      <button style={btn} onClick={load} disabled={loading}>
        {loading ? "Refreshing…" : "Refresh"}
      </button>
      {err && <div style={{ color: "#b00", fontWeight: 700 }}>{err}</div>}
      {state && (
        <div style={row}>
          <div style={kpi}>Pulse<br />{state.pulse}</div>
          <div style={kpi}>ZenCoin<br />{state.zenCoin}</div>
          <div style={kpi}>x Mult<br />{state.multiplier}</div>
          <div style={kpi}>Blessings<br />{state.blessings}</div>
          <div style={kpi}>Burns<br />{state.burns}</div>
        </div>
      )}
    </div>
  );
}
