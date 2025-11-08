"use client";
import React from "react";

type ShadowEntry = {
  id: string;
  text: string;
  emotion: string | null;
  privacy: string | null;
  createdAt: string;
};

export default function ShadowPage() {
  const email = "demo@lumora.local";
  const [items, setItems] = React.useState<ShadowEntry[] | null>(null);
  const [text, setText] = React.useState("");
  const [emotion, setEmotion] = React.useState("neutral");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function load() {
    try {
      const r = await fetch(`/api/lumaspace/shadow?email=${encodeURIComponent(email)}&take=20`, { cache: "no-store" });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "load failed");
      setItems(j.entries);
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  }

  React.useEffect(() => { load(); }, []);

  async function add() {
    if (!text.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/lumaspace/shadow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, text, emotion, privacy: "private" })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "post failed");
      setItems(prev => prev ? [j.entry, ...prev] : [j.entry]);
      setText("");
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string) {
    if (!id) return;
    try {
      await fetch("/api/lumaspace/shadow", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, id })
      });
      setItems(prev => prev ? prev.filter(e => e.id !== id) : prev);
    } catch {}
  }

  return (
    <main style={{ padding: 20, maxWidth: 860, margin: "0 auto" }}>
    <div data-zen-preview-link style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
      <Link href="/me/space" style={{border:"1px solid #0b8",background:"#0b8",color:"#fff",borderRadius:8,padding:"6px 10px",textDecoration:"none",fontWeight:800}}>
        ⚡ Zen Preview
      </Link>
    </div>
      <h1 style={{ marginBottom: 10 }}>Shadow Journal</h1>
      <p style={{ opacity: .8, marginBottom: 14 }}>Private stream for quick emotional notes.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <input
          placeholder="Write a shadow note…"
          value={text}
          onChange={e => setText(e.target.value)}
          style={inputStyle}
        />
        <select value={emotion} onChange={e => setEmotion(e.target.value)} style={inputStyle}>
          <option value="neutral">neutral</option>
          <option value="curious">curious</option>
          <option value="calm">calm</option>
          <option value="anxious">anxious</option>
          <option value="joy">joy</option>
          <option value="sad">sad</option>
          <option value="angry">angry</option>
          <option value="focused">focused</option>
        </select>
        <button onClick={add} disabled={loading} style={btnStyle}>{loading ? "Saving…" : "Add"}</button>
        <button onClick={load} style={{ ...btnStyle, background: "#09f", borderColor: "#09f" }}>Refresh</button>
      </div>

      {err && <div style={{ color: "#c33", marginBottom: 10 }}>Error: {err}</div>}

      {items === null ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ opacity: .8 }}>No entries yet.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {items.map(e => (
            <li key={e.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "rgba(255,255,255,.85)" }}>
              <div style={{ fontSize: 12, opacity: .8 }}>{new Date(e.createdAt).toLocaleString()}</div>
              <div style={{ marginTop: 6 }}>{e.text}</div>
              <div style={{ marginTop: 6, opacity: .85 }}>Mood: {e.emotion || "—"} • Privacy: {e.privacy || "—"}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => del(e.id)} style={{ border:"1px solid #c33", background:"#c33", color:"#fff", borderRadius:8, padding:"6px 10px", cursor:"pointer" }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "8px 10px",
  background: "rgba(255,255,255,.9)"
};
const btnStyle: React.CSSProperties = {
  border: "1px solid #0b8",
  background: "#0b8",
  color: "#fff",
  fontWeight: 700 as any,
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer"
};
