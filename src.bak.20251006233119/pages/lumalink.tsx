import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

type Recent = { ts: number; type: string; userId: string; props?: any };

const Page: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState("Guest");
  const [roomId, setRoomId] = useState("daily-huddle");
  const [scene, setScene] = useState<"real" | "clean" | "nyc" | "studio">("real");
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadRecent() {
    try {
      const r = await fetch("/api/lumalink/recent?n=8");
      if (!r.ok) throw new Error(`${r.status}`);
      const j = await r.json();
      setRecent(j.items ?? []);
    } catch {
      // ignore
    }
  }
  useEffect(() => { loadRecent(); }, []);

  async function onJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/lumalink/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bootstrap_room",
          userId: name || "Guest",
          props: { room: roomId, scene }
        })
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      router.push(`/lumalink/room/${encodeURIComponent(roomId)}?name=${encodeURIComponent(name)}&scene=${encodeURIComponent(scene)}`);
    } catch (err: any) {
      setError(err?.message || "Failed to join.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Inter, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ margin: "0 0 6px 0" }}>LumaLink — Quick Join (MVP)</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>Zoom + Discord vibe — ایک کلک جوائن۔ روم نام دیں، جائن دبائیں — باقی بعد میں RTC۔</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Join a Room</h3>
          <form onSubmit={onJoin}>
            <label style={{ display: "block", margin: "10px 0 6px" }}>Display name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />

            <label style={{ display: "block", margin: "12px 0 6px" }}>Room ID</label>
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />

            <label style={{ display: "block", margin: "12px 0 6px" }}>Scene (demo)</label>
            <select value={scene} onChange={(e) => setScene(e.target.value as any)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
              <option value="real">Real</option>
              <option value="clean">Clean</option>
              <option value="nyc">NYC</option>
              <option value="studio">Studio</option>
            </select>

            <button type="submit" disabled={busy} style={{ marginTop: 14, width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #111", background: busy ? "#999" : "#111", color: "#fff", cursor: busy ? "not-allowed" : "pointer" }}>
              {busy ? "Joining…" : "Join Room"}
            </button>

            {error && <div style={{ marginTop: 8, color: "#b00020" }}>⚠ {error}</div>}
          </form>
        </div>

        <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Recent Events (debug)</h3>
          <ul style={{ marginTop: 8 }}>
            {recent.map((it, i) => (
              <li key={i}>
                <span style={{ opacity: 0.6 }}>{new Date(it.ts).toLocaleTimeString()}</span>
                {" — "}
                <b>{it.type}</b>
                {" by "}
                <i>{it.userId}</i>
                {it.props?.room ? ` • room: ${it.props.room}` : ""}
              </li>
            ))}
            {!recent.length && <li style={{ opacity: 0.6 }}>No events yet.</li>}
          </ul>
          <button onClick={loadRecent} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
