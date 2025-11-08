"use client";
import * as React from "react";

type Mix = { emotion: string; count: number; pct: number };
type MirrorResp = {
  ok: boolean;
  worldId?: string;
  total?: number;
  mirror?: {
    total: number;
    topEmotion?: string;
    mix: Mix[];
    scores?: Record<string, number>;
    updatedAt?: string;
  };
  error?: string;
};

export default function EmotionMirror({ email = "demo@lumora.local", take = 10 }: { email?: string; take?: number }) {
  const [data, setData] = React.useState<MirrorResp | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const url = `/api/lumaspace/mirror?email=${encodeURIComponent(email)}&take=${take}`;
      const r = await fetch(url, { cache: "no-store" });
      const j: MirrorResp = await r.json();
      if (!j.ok) throw new Error(j.error || "mirror not ok");
      setData(j);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, take]);

  const box: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", background: "#fff" };
  const row: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" };
  const tag: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 999, padding: "4px 8px", fontWeight: 800 };
  const list: React.CSSProperties = { display: "grid", gap: 6 };
  const btn: React.CSSProperties = { border: "1px solid #0a7", background: "#0a7", color: "#fff", borderRadius: 8, padding: "6px 10px", fontWeight: 800, cursor: "pointer" };

  const mix = data?.mirror?.mix || [];
  const scores = data?.mirror?.scores || {};
  const top = data?.mirror?.topEmotion || "—";

  return (
    <div style={box}>
      <div style={row}>
        <div style={{ fontWeight: 900 }}>Emotion Mirror</div>
        <div style={tag}>{email}</div>
        <button onClick={load} style={btn} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
      </div>

      {err && <div style={{ color: "#b00", fontWeight: 800, marginTop: 8 }}>{err}</div>}

      {data && (
        <div style={{ marginTop: 8 }}>
          <div style={row}>
            <div style={tag}>Top {top}</div>
            <div style={tag}>Total {data.mirror?.total ?? 0}</div>
            {data.mirror?.updatedAt && <div style={tag}>Updated {new Date(data.mirror.updatedAt).toLocaleTimeString()}</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
            <div style={{ ...box, background: "#f9fafb" }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Mix</div>
              <div style={list}>
                {mix.length === 0 && <div style={{ opacity: 0.7 }}>no data</div>}
                {mix.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800 }}>{m.emotion}</span>
                    <span style={{ opacity: 0.8 }}>{m.count} • {m.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...box, background: "#f9fafb" }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Scores</div>
              <div style={list}>
                {Object.keys(scores).length === 0 && <div style={{ opacity: 0.7 }}>no scores</div>}
                {Object.entries(scores).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800 }}>{k}</span>
                    <span style={{ opacity: 0.8 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
