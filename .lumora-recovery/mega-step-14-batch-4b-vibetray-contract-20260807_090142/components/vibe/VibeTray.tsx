"use client";

import * as React from "react";

type VibeTagItem = {
  slug: string;
  label: string;
  category: string;
  intensity: number;
  rarity?: string | null;
};

async function fetchVibeTags(limit = 80): Promise<VibeTagItem[]> {
  try {
    const res = await fetch(`/api/vibe/tags?limit=${limit}`, { method: "GET" });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok || !Array.isArray(json.items)) return [];
    return json.items as VibeTagItem[];
  } catch {
    return [];
  }
}

async function applyVibe(payload: { userId: string; videoId: string; vibeSlug: string; watchMs: number }) {
  const res = await fetch("/api/vibe/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  return { ok: res.ok && !!json?.ok, status: json?.status, error: json?.error, raw: json };
}

export default function VibeTray(props: { userId?: string; videoId?: string; watchMs?: number }) {
  const userId = props.userId || "me";
  const videoId = props.videoId || "demo_video_001";
  const watchMs = typeof props.watchMs === "number" ? props.watchMs : 6000;

  const [tags, setTags] = React.useState<VibeTagItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [last, setLast] = React.useState<string>("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const items = await fetchVibeTags(80);
      if (!alive) return;
      setTags(items);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onPick = React.useCallback(
    async (slug: string) => {
      setLast(`applying:${slug}`);
      const out = await applyVibe({ userId, videoId: `${videoId}_${Date.now()}`, vibeSlug: slug, watchMs });
      if (out.ok) setLast(`ok:${out.status || "applied"}`);
      else setLast(`err:${out.error || "unknown"}`);
    },
    [userId, videoId, watchMs]
  );

  if (loading) {
    return (
      <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
        Loading vibes…
      </div>
    );
  }

  return (
    <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Vibe Tray (demo)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.slice(0, 24).map((t) => (
          <button
            key={t.slug}
            onClick={() => onPick(t.slug)}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.25)",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
        {tags.length === 0 ? <span style={{ opacity: 0.7 }}>No tags found</span> : null}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>Last: {last || "—"}</div>
    </div>
  );
}
