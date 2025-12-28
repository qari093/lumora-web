"use client";

import React from "react";

type Room = {
  id: string;
  title: string;
  createdAt: string;
  endedAt?: string;
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

export default function LiveClient() {
  const [loading, setLoading] = React.useState(true);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [activeRooms, setActiveRooms] = React.useState<number>(0);
  const [err, setErr] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");

  const refresh = React.useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await j<{ rooms: Room[]; activeRooms: number }>("/api/live/rooms");
      setRooms(data.rooms || []);
      setActiveRooms(Number(data.activeRooms || 0));
    } catch (e: any) {
      setErr(e?.message || "failed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2500);
    return () => clearInterval(t);
  }, [refresh]);

  const onCreate = async () => {
    setErr("");
    try {
      await j("/api/live/rooms", { method: "POST", body: JSON.stringify({ title }) });
      setTitle("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "create_failed");
    }
  };

  const onEnd = async (id: string) => {
    setErr("");
    try {
      await j(`/api/live/rooms/${encodeURIComponent(id)}/end`, { method: "POST", body: "{}" });
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "end_failed");
    }
  };

  const liveOn = activeRooms > 0;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Live status</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginTop: 4 }}>
              {liveOn ? "🔴 Live: ON" : "⚫ Live: OFF"} • Active rooms: {activeRooms}
            </div>
          </div>
          <button
            onClick={refresh}
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            Refresh
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Room title (optional)"
            style={{
              flex: "1 1 260px",
              minWidth: 220,
              borderRadius: 12,
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "inherit",
              outline: "none",
            }}
          />
          <button
            onClick={onCreate}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.08)",
              cursor: "pointer",
              color: "inherit",
              fontWeight: 700,
            }}
          >
            Go Live (create room)
          </button>
        </div>
        {err ? (
          <div style={{ marginTop: 10, color: "rgba(255,120,120,0.95)", fontSize: 13 }}>{err}</div>
        ) : null}
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
          <div style={{ fontWeight: 700, fontSize: 16 }}>Rooms</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{loading ? "Loading…" : `${rooms.length} total`}</div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {rooms.length === 0 && !loading ? (
            <div style={{ opacity: 0.8, fontSize: 13 }}>No rooms yet. Click “Go Live”.</div>
          ) : null}

          {rooms.map((r) => {
            const active = !r.endedAt;
            return (
              <div
                key={r.id}
                style={{
                  borderRadius: 14,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.20)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 700 }}>
                    {active ? "🔴" : "⚫"} {r.title}
                  </div>
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: 4 }}>
                    id: {r.id} • created: {new Date(r.createdAt).toLocaleString()}
                    {r.endedAt ? ` • ended: ${new Date(r.endedAt).toLocaleString()}` : ""}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={`/live/room/${encodeURIComponent(r.id)}`}
                      style={{ fontSize: 13, textDecoration: "underline", opacity: 0.95 }}
                    >
                      Watch room
                    </a>
                    <span style={{ opacity: 0.55, fontSize: 12 }}>Share: /live/room/{r.id}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {active ? (
                    <button
                      onClick={() => onEnd(r.id)}
                      style={{
                        borderRadius: 12,
                        padding: "9px 12px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,80,80,0.12)",
                        cursor: "pointer",
                        color: "inherit",
                        fontWeight: 700,
                      }}
                    >
                      End
                    </button>
                  ) : (
                    <span style={{ opacity: 0.75, fontSize: 12 }}>Ended</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
