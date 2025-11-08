// Location: Editor
// Step 16.43 — app/lumaspace/sync/page.tsx

"use client";

import React, { useEffect, useState } from "react";

type Participant = {
  id: string;
  name: string;
  emotion: string;
  intensity: number;
  joinedAt: number;
};

type SyncEvent = {
  id: string;
  type: "beat" | "drop" | "cheer";
  at: number;
  label: string;
};

const MOCK_PARTICIPANTS: Participant[] = [
  { id: "1", name: "You", emotion: "calm", intensity: 0.6, joinedAt: Date.now() - 10_000 },
  { id: "2", name: "Astra", emotion: "joy", intensity: 0.9, joinedAt: Date.now() - 20_000 },
  { id: "3", name: "Nova", emotion: "focus", intensity: 0.7, joinedAt: Date.now() - 35_000 },
  { id: "4", name: "Lumen", emotion: "curious", intensity: 0.75, joinedAt: Date.now() - 50_000 }
];

const MOCK_EVENTS: SyncEvent[] = [
  { id: "e1", type: "beat", at: 10_000, label: "Opening Beat" },
  { id: "e2", type: "drop", at: 20_000, label: "Light Burst" },
  { id: "e3", type: "beat", at: 30_000, label: "Group Pulse" },
  { id: "e4", type: "cheer", at: 40_000, label: "Collective Cheer" }
];

const TYPE_COLORS: Record<SyncEvent["type"], string> = {
  beat: "bg-sky-500",
  drop: "bg-violet-500",
  cheer: "bg-amber-400"
};

export default function GroupSyncPage() {
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [activeEvent, setActiveEvent] = useState<SyncEvent | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = now - startedAt;
    const windowMs = 800;
    const ev =
      MOCK_EVENTS.find((e) => Math.abs(e.at - t) < windowMs) ??
      null;

    if (ev?.id !== activeEvent?.id) {
      setActiveEvent(ev);

      if (audioEnabled && typeof window !== "undefined" && "Audio" in window && ev) {
        let url =
          ev.type === "beat"
            ? "/demo/media/seg-0001.ts"
            : ev.type === "drop"
            ? "/demo/media/seg-0002.ts"
            : "/demo/media/sample.m3u8";

        try {
          const a = new Audio(url);
          a.volume = ev.type === "cheer" ? 0.5 : 0.25;
          a.play().catch(() => {});
        } catch {
          // ignore audio errors
        }
      }
    }
  }, [now, startedAt, activeEvent, audioEnabled]);

  const elapsed = now - startedAt;
  const timelineLength = 45_000;
  const progress = Math.min(1, Math.max(0, elapsed / timelineLength));

  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400">
              LumaSpace · Group Sync
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold mt-1">
              Group Event Sound &amp; Visual Sync
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Watch everyone&apos;s emotions pulse in time with the shared beat. This
              view is read-only; it mirrors what a live event sync engine would drive.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAudioEnabled((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                audioEnabled
                  ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-200"
                  : "border-slate-600 bg-slate-900 text-slate-300"
              }`}
            >
              {audioEnabled ? "Audio Sync: On" : "Audio Sync: Off"}
            </button>
            <div className="text-right text-xs text-slate-500">
              <div>Elapsed</div>
              <div className="font-mono text-slate-300">
                {(elapsed / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </header>

        <section className="grid lg:grid-cols-3 gap-6">
          {/* Timeline + pulses */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 space-y-5 shadow-[0_0_80px_rgba(56,189,248,0.15)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Event Timeline
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                {(["beat", "drop", "cheer"] as SyncEvent["type"][]).map((t) => (
                  <div key={t} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[t]}`} />
                    <span className="capitalize">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-24">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80" />

              {MOCK_EVENTS.map((ev) => {
                const x = `${(ev.at / timelineLength) * 100}%`;
                const isActive = activeEvent?.id === ev.id;
                return (
                  <div
                    key={ev.id}
                    className="absolute -translate-x-1/2"
                    style={{ left: x, top: "50%" }}
                  >
                    <div
                      className={[
                        "w-2 h-2 rounded-full ring-2 transition-all",
                        TYPE_COLORS[ev.type],
                        isActive ? "scale-150 ring-sky-300/70" : "ring-slate-900/80"
                      ].join(" ")}
                    />
                    <div
                      className={`mt-2 text-[11px] whitespace-nowrap text-center ${
                        isActive ? "text-sky-200" : "text-slate-500"
                      }`}
                    >
                      {ev.label}
                    </div>
                  </div>
                );
              })}

              <div
                className="absolute inset-y-0 w-px bg-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.7)] transition-all"
                style={{ left: `${progress * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <div>0s</div>
              <div>{(timelineLength / 1000).toFixed(0)}s</div>
            </div>
          </div>

          {/* Participants list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Live Participants
              </h2>
              <span className="text-xs text-slate-500">
                {MOCK_PARTICIPANTS.length} connected
              </span>
            </div>
            <div className="space-y-3">
              {MOCK_PARTICIPANTS.map((p) => {
                const isYou = p.name === "You";
                const isPulsing =
                  activeEvent != null &&
                  (p.emotion === "joy" || p.emotion === "focus" || p.emotion === "curious");
                const width = `${Math.round(p.intensity * 100)}%`;

                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-100">
                          {p.name}
                        </span>
                        {isYou && (
                          <span className="px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 text-[10px] border border-sky-500/40">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="capitalize text-slate-400">
                        {p.emotion}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-emerald-400 transition-all ${
                          isPulsing ? "animate-pulse" : ""
                        }`}
                        style={{ width }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Sync intensity</span>
                      <span className="font-mono text-slate-300">
                        {(p.intensity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active event callout */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Live sync status
              </div>
              {activeEvent ? (
                <div className="text-slate-100">
                  {activeEvent.label}{" "}
                  <span className="text-slate-500">
                    · {activeEvent.type.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400">
                  Waiting for next beat in the sequence…
                </div>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
            <span>Visuals are synced client-side for demo only.</span>
          </div>
        </section>
      </div>
    </main>
  );
}