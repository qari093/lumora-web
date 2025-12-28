"use client";

import React from "react";

type Room = {
  id: string;
  title: string;
  createdAt: string;
  endedAt?: string;
};

type Reaction = {
  id: string;
  roomId: string;
  kind: "emoji" | "avatar";
  payload: string;
  createdAt: string;
};

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ""}`);
  }
  return (await res.json()) as T;
}

function pickStringFromAny(x: any): string | null {
  if (!x) return null;
  if (typeof x === "string") return x;
  if (Array.isArray(x)) {
    for (const it of x) {
      const s = pickStringFromAny(it);
      if (s) return s;
    }
    return null;
  }
  if (typeof x === "object") {
    // try common keys first
    for (const k of ["emoji", "glyph", "value", "text", "url", "src", "imageUrl", "assetUrl", "id"]) {
      const v = (x as any)[k];
      const s = pickStringFromAny(v);
      if (s) return s;
    }
    // otherwise any string field
    for (const k of Object.keys(x)) {
      const v = (x as any)[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return null;
}

async function getLatestHybridEmoji(): Promise<string | null> {
  // best-effort: prefer generated emoji list, fall back to placeholder endpoint if present
  try {
    const a: any = await j<any>("/api/hybrid/emoji/list");
    const arr = a?.items || a?.emojis || a?.data || a;
    const v = pickStringFromAny(arr);
    return v;
  } catch {}
  try {
    const b: any = await j<any>("/api/hybrid/placeholder/emoji");
    return pickStringFromAny(b);
  } catch {}
  return null;
}

async function getLatestHybridAvatar(): Promise<string | null> {
  try {
    const a: any = await j<any>("/api/hybrid/avatar/list");
    const arr = a?.items || a?.avatars || a?.data || a;
    const v = pickStringFromAny(arr);
    return v;
  } catch {}
  try {
    const b: any = await j<any>("/api/hybrid/placeholder/avatar");
    return pickStringFromAny(b);
  } catch {}
  return null;
}

export default function RoomClient({ roomId }: { roomId: string }) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [reactions, setReactions] = React.useState<Reaction[]>([]);
  const [err, setErr] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);

  const refresh = React.useCallback(async () => {
    setErr("");
    try {
      const r = await j<{ room: Room }>(`/api/live/rooms/${encodeURIComponent(roomId)}`);
      setRoom(r.room);
      const rx = await j<{ reactions: Reaction[] }>(`/api/live/rooms/${encodeURIComponent(roomId)}/reactions`);
      setReactions(rx.reactions || []);
    } catch (e: any) {
      setErr(e?.message || "failed");
    }
  }, [roomId]);

  React.useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, [refresh]);

  const sendEmoji = async () => {
    setBusy(true);
    setErr("");
    try {
      const payload = (await getLatestHybridEmoji()) || "✨";
      await j(`/api/live/rooms/${encodeURIComponent(roomId)}/react`, {
        method: "POST",
        body: JSON.stringify({ kind: "emoji", payload }),
      });
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "emoji_failed");
    } finally {
      setBusy(false);
    }
  };

  const sendAvatar = async () => {
    setBusy(true);
    setErr("");
    try {
      const payload = (await getLatestHybridAvatar()) || "avatar:placeholder";
      await j(`/api/live/rooms/${encodeURIComponent(roomId)}/react`, {
        method: "POST",
        body: JSON.stringify({ kind: "avatar", payload }),
      });
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "avatar_failed");
    } finally {
      setBusy(false);
    }
  };

  const ended = Boolean(room?.endedAt);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>
          {ended ? "⚫" : "🔴"} {room?.title || "Live Room"}
        </div>
        <div style={{ opacity: 0.8, fontSize: 12, marginTop: 6 }}>
          id: {roomId}{" "}
          {room?.createdAt ? `• created: ${new Date(room.createdAt).toLocaleString()}` : ""}
          {room?.endedAt ? ` • ended: ${new Date(room.endedAt).toLocaleString()}` : ""}
        </div>

        <div
          style={{
            marginTop: 12,
            height: 280,
            borderRadius: 14,
            border: "1px dashed rgba(255,255,255,0.18)",
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ textAlign: "center", opacity: 0.9 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Player Placeholder</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Stream playback integration comes next. Reactions already work (emoji/avatar).
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            disabled={busy || ended}
            onClick={sendEmoji}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.08)",
              cursor: busy || ended ? "not-allowed" : "pointer",
              color: "inherit",
              fontWeight: 900,
            }}
          >
            Send Emoji Reaction
          </button>
          <button
            disabled={busy || ended}
            onClick={sendAvatar}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.08)",
              cursor: busy || ended ? "not-allowed" : "pointer",
              color: "inherit",
              fontWeight: 900,
            }}
          >
            Send Avatar Reaction
          </button>
          <a href="/emoji-lab" style={{ textDecoration: "underline", opacity: 0.95, fontSize: 13 }}>
            Emoji Lab
          </a>
          <a href="/avatar-lab" style={{ textDecoration: "underline", opacity: 0.95, fontSize: 13 }}>
            Avatar Lab
          </a>
          <a href="/hybrid" style={{ textDecoration: "underline", opacity: 0.95, fontSize: 13 }}>
            Hybrid
          </a>
          <a href="/live" style={{ textDecoration: "underline", opacity: 0.95, fontSize: 13 }}>
            Back
          </a>
        </div>

        {err ? <div style={{ marginTop: 10, color: "rgba(255,120,120,0.95)", fontSize: 13 }}>{err}</div> : null}
        {ended ? <div style={{ marginTop: 10, opacity: 0.85, fontSize: 13 }}>Room ended — reactions locked.</div> : null}
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Reactions</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{reactions.length} shown</div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {reactions.length === 0 ? (
            <div style={{ opacity: 0.8, fontSize: 13 }}>No reactions yet. Send an emoji or avatar reaction.</div>
          ) : null}

          {reactions.map((rx) => (
            <div
              key={rx.id}
              style={{
                borderRadius: 14,
                padding: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.20)",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 240 }}>
                <div style={{ fontWeight: 900, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{rx.kind === "emoji" ? "✨ Emoji" : "🧑 Avatar"}</span>
                  <span style={{ opacity: 0.8, fontSize: 12 }}>{new Date(rx.createdAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ opacity: 0.9, marginTop: 6, wordBreak: "break-word" }}>{rx.payload}</div>
              </div>

              {rx.kind === "avatar" && /^https?:\/\//i.test(rx.payload) ? (
                <img
                  src={rx.payload}
                  alt="avatar"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              ) : (
                <div style={{ opacity: 0.6, fontSize: 12 }}> </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
