"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getVariantCards, pickFypVariant, type FypVariant } from "./variants";

const LS_SEEN = "lumora_fyp_seen_count_v1";
const LS_SEED = "lumora_fyp_device_seed_v1";

function getOrCreateSeed(): string {
  try {
    const existing = localStorage.getItem(LS_SEED);
    if (existing && existing.length >= 8) return existing;
    const seed = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9-]/g, "");
    localStorage.setItem(LS_SEED, seed);
    return seed;
  } catch {
    return "fallback-seed";
  }
}

function getSeenCount(): number {
  try {
    const raw = localStorage.getItem(LS_SEEN);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  } catch {
    return 0;
  }
}

function bumpSeenCount(): number {
  const n = getSeenCount() + 1;
  try {
    localStorage.setItem(LS_SEEN, String(n));
  } catch {}
  return n;
}

export default function FypFlow() {
  const [variant, setVariant] = useState<FypVariant>("A");
  const [seen, setSeen] = useState<number>(0);

  useEffect(() => {
    const seed = getOrCreateSeed();
    const prev = getSeenCount();
    const nextSeen = bumpSeenCount(); // session-open bump
    setSeen(nextSeen);
    setVariant(pickFypVariant(seed, prev)); // use previous count for "repeat-session variation"
  }, []);

  const cards = useMemo(() => getVariantCards(variant), [variant]);

  return (
    <section data-testid="fyp-scroll" className="mt-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Flow</h2>
        <div className="text-xs opacity-60">
          <span>variant {variant}</span>
          <span className="mx-2">•</span>
          <span>opens {seen}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        {cards.map((c) => (
          <div data-testid="fyp-card"
            key={c.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition-transform will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="text-sm font-medium">{c.title}</div>
            <div className="text-xs opacity-70 mt-1">{c.subtitle}</div>
          </div>
        ))}
      </div>

      <div id="LUMORA_FYP_REPEAT_VARIATION" style={{ display: "none" }}>
        alive
      </div>
    </section>
  );
}
