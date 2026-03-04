"use client";

import { useEffect, useState } from "react";

type LiveRoom = {
  id: string;
  title: string;
  topic: string;
  lang: string;
  capacity: number;
  isGameRoom: boolean;
};

export default function RoomList() {
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/live/rooms", { cache: "no-store" });
        const json = await res.json();
        if (!json?.ok) throw new Error(json?.error || "rooms_error");
        if (!cancelled) setRooms(Array.isArray(json.rooms) ? json.rooms : []);
      } catch (e: any) {
        if (!cancelled) setErr(typeof e?.message === "string" ? e.message : "rooms_error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div data-testid="live-rooms-root" className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Live Rooms</h2>
        <div className="text-xs opacity-60" data-testid="live-rooms-count">
          {rooms.length} rooms
        </div>
      </div>

      {err ? (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm" data-testid="live-rooms-error">
          {err}
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {rooms.map((r) => (
          <a
            key={r.id}
            href={`/live/room?id=${encodeURIComponent(r.id)}`}
            data-testid="live-room-row"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{r.title}</div>
              <div className="mt-0.5 truncate text-xs opacity-70">
                {r.topic} • {r.lang} • cap {r.capacity} {r.isGameRoom ? "• game" : ""}
              </div>
            </div>
            <div className="ml-3 shrink-0 text-xs opacity-60">Join →</div>
          </a>
        ))}
      </div>

      <div id="LUMORA_LIVE_ROOMS_ALIVE" style={{ display: "none" }}>
        alive
      </div>
    </div>
  );
}
