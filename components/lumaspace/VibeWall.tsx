"use client";

import React from "react";

type TxItem = {
  id?: string;
  createdAt?: string | number | Date;
  videoId?: string;
  vibeSlug?: string;
  watchMs?: number;
};

async function safeGetJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json()) as T;
    return json;
  } catch {
    return null;
  }
}

export default function VibeWall() {
  // NOTE: userId wiring will be upgraded later; for now keep stable demo fallback.
  const userId = "me";
  const [wall, setWall] = React.useState<TxItem[]>([]);
  const [recent, setRecent] = React.useState<TxItem[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready">("idle");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      setStatus("loading");
      const w = await safeGetJson<any>(`/api/vibe/wall?userId=${encodeURIComponent(userId)}&limit=30`);
      const r = await safeGetJson<any>(`/api/vibe/my-recent?userId=${encodeURIComponent(userId)}&limit=12`);
      if (!alive) return;

      setWall(Array.isArray(w?.items) ? w.items : []);
      setRecent(Array.isArray(r?.items) ? r.items : []);
      setStatus("ready");
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Vibe Wall</div>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        {status === "loading" ? "Loading…" : "Your recent vibes + wall feed"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <section style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>My Recent</div>
          {recent.length === 0 ? (
            <div style={{ opacity: 0.75 }}>No recent vibes yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {recent.map((it, idx) => (
                <li key={it.id || String(idx)}>
                  <span style={{ fontWeight: 600 }}>{it.vibeSlug || "vibe"}</span>
                  <span style={{ opacity: 0.75 }}> · {String(it.videoId || "video")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Wall</div>
          {wall.length === 0 ? (
            <div style={{ opacity: 0.75 }}>No wall items yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {wall.map((it, idx) => (
                <li key={it.id || String(idx)}>
                  <span style={{ fontWeight: 600 }}>{it.vibeSlug || "vibe"}</span>
                  <span style={{ opacity: 0.75 }}> · {String(it.videoId || "video")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
