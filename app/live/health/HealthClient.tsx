"use client";

import { useEffect, useMemo, useState } from "react";

type Badge = {
  ok?: boolean;
  service?: string;
  ts?: string;
  requestId?: string;
  checks?: Record<string, unknown>;
  marker?: string;
};

type Rooms = {
  ok?: boolean;
  ts?: string;
  requestId?: string;
  rooms?: unknown[];
  activeRooms?: number;
  marker?: string;
};

function safeJson(s: string) {
  try {
    return JSON.parse(s) as any;
  } catch {
    return null;
  }
}

export default function HealthClient() {
  const base = useMemo(() => {
    const env = (process.env.NEXT_PUBLIC_LIVE_BASE_URL || "").trim();
    if (env) return env.replace(/\/$/, "");
    return "";
  }, []);

  const [badge, setBadge] = useState<Badge | null>(null);
  const [rooms, setRooms] = useState<Rooms | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setErr(null);
      try {
        const [b, r] = await Promise.all([
          fetch((base ? base : "") + "/api/live/health-badge", { cache: "no-store" }).then(async (res) => ({
            ok: res.ok,
            text: await res.text(),
          })),
          fetch((base ? base : "") + "/api/live/rooms", { cache: "no-store" }).then(async (res) => ({
            ok: res.ok,
            text: await res.text(),
          })),
        ]);

        if (cancelled) return;

        const bj = safeJson(b.text);
        const rj = safeJson(r.text);

        setBadge(bj);
        setRooms(rj);

        if (!b.ok || !r.ok) {
          setErr("One or more Live endpoints returned non-200.");
        }
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message || "Failed to load Live health endpoints.");
      }
    }

    load();
    const t = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [base]);

  const okBadge = badge?.ok === true;
  const okRooms = rooms?.ok === true;

  return (
    <section style={{ marginTop: 18, display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Status</h2>
        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          <div>
            <strong>health-badge:</strong> {okBadge ? "OK" : "NOT OK"}
            {badge?.service ? <span style={{ opacity: 0.75 }}> ({badge.service})</span> : null}
          </div>
          <div>
            <strong>rooms:</strong> {okRooms ? "OK" : "NOT OK"}
            {typeof rooms?.activeRooms === "number" ? (
              <span style={{ opacity: 0.75 }}> (activeRooms={rooms.activeRooms})</span>
            ) : null}
          </div>
          {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
        </div>
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Raw</h2>

        <h3 style={{ margin: "12px 0 6px", fontSize: 13, opacity: 0.8 }}>health-badge</h3>
        <pre style={{ margin: 0, padding: 10, borderRadius: 10, background: "rgba(0,0,0,0.04)", overflowX: "auto" }}>
{JSON.stringify(badge, null, 2)}
        </pre>

        <h3 style={{ margin: "12px 0 6px", fontSize: 13, opacity: 0.8 }}>rooms</h3>
        <pre style={{ margin: 0, padding: 10, borderRadius: 10, background: "rgba(0,0,0,0.04)", overflowX: "auto" }}>
{JSON.stringify(rooms, null, 2)}
        </pre>
      </div>
    </section>
  );
}
