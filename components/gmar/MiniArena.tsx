"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type RunState = "idle" | "running" | "ended";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function nowMs() {
  return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
}

function seededRand(seedStr: string) {
  // FNV-1a 32-bit -> mulberry32
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MiniArena() {
  const [state, setState] = useState<RunState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [tick, setTick] = useState(0);

  const startRef = useRef<number>(0);
  const endRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const seed = useMemo(() => {
    const d = new Date();
    const day = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    return `gmar-mini-arena:${day}`;
  }, []);
  const rand = useMemo(() => seededRand(seed), [seed]);

  const durationMs = 9900; // "99 seconds" vibe, but ultra-minimal
  const targetEveryMs = 650;

  const [target, setTarget] = useState(() => ({
    x: 30,
    y: 30,
    r: 18,
    id: 1,
  }));

  const spawnTarget = () => {
    const id = (target.id + 1) % 1e9;
    const r = clamp(14 + Math.floor(rand() * 10), 14, 26);
    const x = clamp(10 + Math.floor(rand() * 280), 10, 300);
    const y = clamp(10 + Math.floor(rand() * 180), 10, 200);
    setTarget({ x, y, r, id });
  };

  useEffect(() => {
    try {
      const k = localStorage.getItem("LUMORA_GMAR_MINI_BEST");
      if (k) setBest(Math.max(0, parseInt(k, 10) || 0));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("LUMORA_GMAR_MINI_BEST", String(best));
    } catch {}
  }, [best]);

  useEffect(() => {
    if (state !== "running") return;

    let lastTargetAt = nowMs();
    startRef.current = nowMs();
    endRef.current = startRef.current + durationMs;

    const loop = () => {
      const t = nowMs();
      if (t >= endRef.current) {
        setState("ended");
        setBest((b) => Math.max(b, score));
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }
      if (t - lastTargetAt >= targetEveryMs) {
        lastTargetAt = t;
        spawnTarget();
      }
      setTick((x) => x + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const remaining = state === "running" ? Math.max(0, Math.ceil((endRef.current - nowMs()) / 1000)) : 0;

  const onHit = () => {
    if (state !== "running") return;
    setScore((s) => s + 1);
    spawnTarget();
  };

  const reset = () => {
    setScore(0);
    spawnTarget();
    setState("running");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Mini Arena</div>
          <div className="text-xs opacity-70">Tap targets. Fast, deterministic, always playable.</div>
        </div>
        <div className="text-right text-xs opacity-70">
          <div data-testid="gmar-mini-timer">t-{state === "running" ? remaining : "—"}</div>
          <div>best {best}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {state !== "running" ? (
          <button
            data-testid="gmar-mini-start"
            onClick={reset}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15 active:scale-[0.99]"
          >
            {state === "ended" ? "Play again" : "Play now"}
          </button>
        ) : (
          <button
            data-testid="gmar-mini-stop"
            onClick={() => setState("ended")}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15 active:scale-[0.99]"
          >
            End
          </button>
        )}
        <div className="text-sm">
          score <span data-testid="gmar-mini-score" className="font-semibold">{score}</span>
        </div>
      </div>

      <div
        data-testid="gmar-mini-canvas"
        className="mt-3 relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
        style={{ width: 320, height: 220 }}
        aria-label="Mini Arena"
      >
        {state === "running" && (
          <button
            data-testid="gmar-mini-target"
            onClick={onHit}
            className="absolute rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40"
            style={{
              left: target.x,
              top: target.y,
              width: target.r * 2,
              height: target.r * 2,
              transform: "translate(-50%, -50%)",
            }}
            aria-label="Target"
          />
        )}
        <div id="LUMORA_GMAR_PLAYABLE_SURFACE" style={{ display: "none" }}>alive</div>
        <div className="absolute bottom-2 left-2 text-[11px] opacity-60">tick {tick}</div>
      </div>

      {state === "ended" && (
        <div data-testid="gmar-mini-ended" className="mt-3 text-xs opacity-70">
          Run ended. Score saved locally.
        </div>
      )}
    </div>
  );
}
