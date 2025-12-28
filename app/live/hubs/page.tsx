"use client";

import { useEffect, useMemo, useState } from "react";

type Hub = {
  id: string;
  title: string;
  roomId: string;
  createdAt: string;
  clipCount: number;
  chatActive: boolean;
  lastPersona?: { avatarId: string | null; emojiId: string | null } | null;
  lastEvent?: { type: string; payload?: any; ts?: string } | null;
  lastActivityAt?: string | null;
};

async function fetchHubs(): Promise<Hub[]> {
  const res = await fetch("/api/live/portal-hubs", { cache: "no-store" });
  const j = await res.json();
  return Array.isArray(j?.hubs) ? (j.hubs as Hub[]) : [];
}

export default function LiveHubsPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const [sseState, setSseState] = useState<"connecting" | "connected" | "error">("connecting");

  const refresh = async () => {
    try {
      setLoading(true);
      const list = await fetchHubs();
      setHubs(list);
      setLastRefresh(new Date().toISOString());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  // SSE: subscribe to demo-room and refresh hubs on persona_update/mic
  useEffect(() => {
    if (typeof window === "undefined") return;
    const roomId = "demo-room";
    const es = new EventSource(`/api/live/events?roomId=${encodeURIComponent(roomId)}`);

    const onAny = () => void refresh();

    es.addEventListener("hello", () => setSseState("connected"));
    es.addEventListener("persona_update", onAny);
    es.addEventListener("mic", onAny);
    es.addEventListener("ping", () => {});
    es.onerror = () => setSseState("error");

    return () => {
      try {
        es.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const pills = useMemo(() => {
    const t = lastRefresh ? `${lastRefresh.slice(11, 19)}Z` : "—";
    const loadPill =
      loading ? "Loading" : "Ready";
    const ssePill =
      sseState === "connected" ? "SSE: connected" : sseState === "error" ? "SSE: error" : "SSE: connecting";
    return { t, loadPill, ssePill };
  }, [lastRefresh, loading, sseState]);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Portal Hubs</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <a className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50" href="/live">
              Back to Live
            </a>
            <button
              onClick={() => void refresh()}
              className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border px-2 py-0.5 bg-neutral-50 text-neutral-700 border-neutral-200">
            Live refresh: demo-room SSE
          </span>
          <span className="rounded-full border px-2 py-0.5 bg-neutral-50 text-neutral-600 border-neutral-200">
            Updated: {pills.t}
          </span>
          <span
            className={
              "rounded-full border px-2 py-0.5 " +
              (loading ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")
            }
          >
            {pills.loadPill}
          </span>
          <span
            className={
              "rounded-full border px-2 py-0.5 " +
              (sseState === "connected"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : sseState === "error"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-neutral-50 text-neutral-700 border-neutral-200")
            }
          >
            {pills.ssePill}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((h) => {
          const persona = h.lastPersona || null;
          const lastEventType = h.lastEvent?.type || "—";
          const activity = h.lastActivityAt ? `${h.lastActivityAt.slice(11, 19)}Z` : "—";
          const emoji = persona?.emojiId ? String(persona.emojiId) : "—";
          const avatar = persona?.avatarId ? String(persona.avatarId) : "—";
          return (
            <article key={h.id} className="rounded-xl border p-4 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-500">Room</div>
                  <div className="font-semibold">{h.roomId}</div>
                  <div className="text-xs text-neutral-500 mt-1">Hub ID: {h.id}</div>
                </div>
                <a
                  className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
                  href={`/live/room/${encodeURIComponent(h.roomId)}`}
                >
                  Open room
                </a>
              </div>

              <div className="mt-3 text-sm text-neutral-800">{h.title}</div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-700">
                <div className="rounded-lg border bg-neutral-50 p-2">
                  <div className="text-neutral-500">Last persona</div>
                  <div className="mt-1">emoji: {emoji}</div>
                  <div>avatar: {avatar}</div>
                </div>
                <div className="rounded-lg border bg-neutral-50 p-2">
                  <div className="text-neutral-500">Activity</div>
                  <div className="mt-1">last event: {lastEventType}</div>
                  <div>time: {activity}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border px-2 py-0.5 bg-neutral-50 border-neutral-200 text-neutral-700">
                  clips: {h.clipCount}
                </span>
                <span
                  className={
                    "rounded-full border px-2 py-0.5 " +
                    (h.chatActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-50 text-neutral-700 border-neutral-200")
                  }
                >
                  chat: {h.chatActive ? "active" : "inactive"}
                </span>
                <span className="rounded-full border px-2 py-0.5 bg-neutral-50 border-neutral-200 text-neutral-700">
                  created: {h.createdAt ? `${h.createdAt.slice(0, 10)}` : "—"}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {hubs.length === 0 ? (
        <div className="text-sm text-neutral-600">
          No hubs yet. Go to <a className="underline" href="/live">/live</a> and join the demo room.
        </div>
      ) : null}
    </main>
  );
}
