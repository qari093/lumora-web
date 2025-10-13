"use client";

import { useEffect, useState } from "react";

type Clip = { id: string; title: string; url: string; createdAt: number };

export default function FypPage() {
  const [items, setItems] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/fyp/recommend?limit=20", { cache: "no-store" });
    const j = await r.json();
    setItems(j.items || []);
  }

  async function generate() {
    setLoading(true);
    try {
      const r = await fetch("/api/fyp/generate", { method: "POST" });
      await r.json();
      await load();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ marginBottom: 12 }}>Lumora — FYP Debug</h1>

      <button
        onClick={generate}
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: loading ? "default" : "pointer",
          background: loading ? "#f2f2f2" : "white"
        }}
      >
        {loading ? "Generating…" : "Generate Clip"}
      </button>

      <div style={{ marginTop: 20 }}>
        {items.length === 0 ? (
          <p>No clips yet.</p>
        ) : (
          items.map((c) => (
            <div key={c.id} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
              <div style={{ fontSize: 14, color: "#666" }}>
                <b>{c.title}</b> — {new Date(c.createdAt).toLocaleString()}
              </div>
              <video
                src={c.url}
                controls
                preload="metadata"
                style={{ width: "100%", marginTop: 8, borderRadius: 8, background: "#000" }}
              />
              <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{c.url}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
