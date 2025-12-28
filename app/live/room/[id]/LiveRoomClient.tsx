"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LiveSpecBadge from "@/app/_client/live/LiveSpecBadge";
import EmojiPicker from "@/app/_client/persona/EmojiPicker";
import AvatarPicker from "@/app/_client/persona/AvatarPicker";
import { useLiveVoiceMeter } from "@/app/_client/persona/useLiveVoiceMeter";

type RoomState = {
  ok: boolean;
  state?: {
    roomId: string;
    persona: { avatarId: string | null; emojiId: string | null };
    updatedAt: string;
  };
};

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function lsKey(roomId: string) {
  return `lumora.live.roomstate.v1:${roomId}`;
}

export default function LiveRoomClient() {
  // Derive roomId from pathname (works without prop wiring)
  const roomId = useMemo(() => {
    if (typeof window === "undefined") return "demo-room";
    const p = window.location.pathname;
    const m = p.match(/\/live\/room\/([^/]+)/);
    return (m?.[1] || "demo-room").trim();
  }, []);

  const [micEnabled, setMicEnabled] = useState(false);
  const micLevel = useLiveVoiceMeter(micEnabled);
  const speaking = micLevel > 0.05;

  // Best-effort: send mic telemetry to server (SSE bus) when mic is enabled (throttled)
  useEffect(() => {
    if (!micEnabled) return;
    let alive = true;
    const post = async () => {
      if (!alive) return;
      const now = Date.now();
      if (now - lastMicPostAtRef.current < 500) return;
      lastMicPostAtRef.current = now;
      try {
        await fetch("/api/live/mic", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ roomId, enabled: micEnabled, level: micLevel, speaking }),
        });
      } catch {
        // ignore
      }
    };
    const id = window.setInterval(() => { void post(); }, 250);
    return () => { alive = false; window.clearInterval(id); };
  }, [roomId, micEnabled, micLevel, speaking]);

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null); // "emoji_001.png"
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // "neutral/avatar_001.png"
  const [syncNote, setSyncNote] = useState<string>("");
  const [lastEvent, setLastEvent] = useState<string>("");
/* WELLNESS_V1 */
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [fatigueHint, setFatigueHint] = useState<string>("");
  const sessionStartRef = useRef<number>(0);
  const wellnessDismissUntilRef = useRef<number>(0);

  /* WELLNESS_TIMER_V1 */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // initialize start time once
    if (!sessionStartRef.current) sessionStartRef.current = Date.now();

    // hydrate dismiss-until
    try {
      const key = `live_wellness_dismiss_until_${roomId}`;
      const raw = window.localStorage.getItem(key);
      const n = raw ? Number(raw) : 0;
      if (Number.isFinite(n) && n > 0) wellnessDismissUntilRef.current = n;
    } catch {}

    const id = window.setInterval(() => {
      const mins = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      setSessionMinutes(mins);

      // light fatigue hint every 30 minutes (non-blocking)
      if (mins >= 30 && mins % 30 === 0) {
        setFatigueHint(`You're ${mins} min in — consider a quick break.`);
        window.setTimeout(() => setFatigueHint(""), 9000);
      }

      // hard prompt at 120 minutes (2 hours) unless dismissed recently
      if (mins >= 120) {
        const now = Date.now();
        if (now > (wellnessDismissUntilRef.current || 0)) {
          setWellnessOpen(true);
        }
      }
    }, 15000);

    return () => window.clearInterval(id);
  }, [roomId]);

  // When opened, set a 15-minute quiet window after dismiss
  const dismissWellness = () => {
    const until = Date.now() + 15 * 60 * 1000;
    wellnessDismissUntilRef.current = until;
    try {
      window.localStorage.setItem(`live_wellness_dismiss_until_${roomId}`, String(until));
    } catch {}
    setWellnessOpen(false);
  };
  const [sseOk, setSseOk] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const lastMicPostAtRef = useRef<number>(0);

  const didInit = useRef(false);
  const saveTimer = useRef<number | null>(null);

  const micLabel = useMemo(() => (micEnabled ? "Mic: ON" : "Mic: OFF"), [micEnabled]);

  // Initial load: localStorage first, then server
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const cached = safeJsonParse<{ persona?: { emojiId?: string | null; avatarId?: string | null } }>(
      typeof window !== "undefined" ? window.localStorage.getItem(lsKey(roomId)) : null
    );

    if (cached?.persona) {
      if (typeof cached.persona.emojiId === "string" || cached.persona.emojiId === null) setSelectedEmoji(cached.persona.emojiId ?? null);
      if (typeof cached.persona.avatarId === "string" || cached.persona.avatarId === null) setSelectedAvatar(cached.persona.avatarId ?? null);
      setSyncNote("Loaded from device cache");
    }

    (async () => {
      try {
        const r = await fetch(`/api/live/room-state?roomId=${encodeURIComponent(roomId)}`, { cache: "no-store" });
        const j = (await r.json()) as RoomState;
        if (!j?.ok || !j.state) return;

        // Server wins only if localStorage empty for that field
        setSelectedEmoji((prev) => (prev ? prev : j.state!.persona.emojiId ?? null));
        setSelectedAvatar((prev) => (prev ? prev : j.state!.persona.avatarId ?? null));
        setSyncNote("Synced from server");
      } catch {
        // ignore
      }
    })();
  }, [roomId]);

  // Realtime: subscribe to server-sent events (best-effort)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const es = new EventSource(`/api/live/events?roomId=${encodeURIComponent(roomId)}`);
    es.addEventListener("hello", (ev: MessageEvent) => setLastEvent(`hello ${String(ev.data).slice(0, 120)}`));
    es.addEventListener("hello", () => setSseOk(true));
    es.addEventListener("persona_update", (ev: MessageEvent) => setLastEvent(`persona_update ${String(ev.data).slice(0, 140)}`));
    es.addEventListener("mic", (ev: MessageEvent) => setLastEvent(`mic ${String(ev.data).slice(0, 140)}`));
    es.addEventListener("ping", () => {});
    es.onerror = () => { setSseOk(false); };
    return () => { try { es.close(); } catch {} };
  }, [roomId]);

  // Persist to localStorage immediately on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = { roomId, persona: { emojiId: selectedEmoji, avatarId: selectedAvatar }, ts: new Date().toISOString() };
    window.localStorage.setItem(lsKey(roomId), JSON.stringify(payload));
  }, [roomId, selectedEmoji, selectedAvatar]);

  // Debounced persist to server (POST)
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        await fetch("/api/live/room-state", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ roomId, persona: { emojiId: selectedEmoji, avatarId: selectedAvatar } }),
        });
        setSyncNote("Saved");
      } catch {
        setSyncNote("Save skipped");
      }
    }, 350);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [roomId, selectedEmoji, selectedAvatar]);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      {/* LIVE_ROOM_STATUS_BAR_V1 */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 bg-white">
        <div className="text-sm text-neutral-700">
          Room: <span className="font-mono">{roomId}</span>
        </div>
        <div className="flex items-center gap-3">
          <a className="text-sm underline" href="/live">Live</a>
          <a className="text-sm underline" href="/live/hubs">Portal Hubs</a>
          <div className="shrink-0"><LiveSpecBadge mode="compact" /></div>
        </div>
      </section>
      <LiveSpecBadge mode="compact" />

      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Live Room (Demo)</h2>
          <div className="text-xs text-neutral-500">
            Room: <span className="font-mono">{roomId}</span> · {syncNote}
          </div>
        </div>

        <button
          onClick={() => setMicEnabled((v) => !v)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
        >
          {micLabel}
        </button>
      </section>

        /* WELLNESS_UI_V1 */
        {fatigueHint ? (
          <div className="rounded-md border bg-white px-3 py-2 text-xs text-neutral-700">
            {fatigueHint}
          </div>
        ) : null}

        {wellnessOpen ? (
          <div className="rounded-md border bg-white p-3 text-sm">
            <div className="font-semibold">Wellness check</div>
            <div className="mt-1 text-neutral-700">
              You’ve been live for <span className="font-medium">{sessionMinutes}</span> minutes.
              Consider a short break.
              <span className="block text-xs text-neutral-500 mt-1">
                (UI-only now; stream-layer auto-pause will be enforced later.)
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-md border px-3 py-1 text-xs hover:bg-neutral-50"
                onClick={dismissWellness}
              >
                Dismiss (15m)
              </button>
              <a
                className="rounded-md border px-3 py-1 text-xs hover:bg-neutral-50"
                href="/live"
              >
                Exit room
              </a>
            </div>
          </div>
        ) : null}


      <section className="text-sm text-neutral-700">
        <div>Mic level: {micLevel.toFixed(3)}</div>
        <div>Speaking: {speaking ? "yes" : "no"}</div>
        <div className="text-xs text-neutral-500">
          Selected: emoji={selectedEmoji ?? "—"} · avatar={selectedAvatar ?? "—"}
        </div>
        <div className="text-xs text-neutral-500">
          Last event: {lastEvent ? lastEvent : "—"}

        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Send Emoji</h3>
          <EmojiPicker selected={selectedEmoji} onSelect={(id) => setSelectedEmoji(id)} />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Choose Avatar</h3>
          <AvatarPicker selected={selectedAvatar} onSelect={(id) => setSelectedAvatar(id)} />
        </div>
      </section>
    </main>
  );
}
