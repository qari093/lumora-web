
export type FypVariant = "A" | "B" | "C";

/**
 * Deterministic variant selection based on (seed, seenCount).
 * - seed: stable per device/session (e.g., localStorage device id)
 * - seenCount: number of prior sessions opens (>=0)
 */
export function pickFypVariant(seed: string, seenCount: number): FypVariant {
  const s = typeof seed === "string" ? seed : "";
  const n = Number.isFinite(seenCount) ? Math.max(0, Math.floor(seenCount)) : 0;

  // Simple 32-bit hash (FNV-1a like) + seenCount mix
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h = (h ^ (n + 1)) >>> 0;
  h = Math.imul(h, 2246822507) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;

  const r = h % 3;
  return r === 0 ? "A" : r === 1 ? "B" : "C";
}

export type FypCard = { id: string; title: string; subtitle: string };

export function getVariantCards(v: FypVariant): FypCard[] {
  // Keep non-empty invariant.
  if (v === "A") {
    return [
      { id: "a-1", title: "Signal Drift", subtitle: "Short pulses that change every visit." },
      { id: "a-2", title: "Ambient Thread", subtitle: "A calm strand to start your scroll." },
      { id: "a-3", title: "Micro-Discovery", subtitle: "A small surprise, always." },
    ];
  }
  if (v === "B") {
    return [
      { id: "b-1", title: "Momentum Loop", subtitle: "Faster tempo: quick tiles, quick shifts." },
      { id: "b-2", title: "Orbital Picks", subtitle: "A rotating ring of featured items." },
      { id: "b-3", title: "Quiet Boost", subtitle: "One calming anchor, then motion." },
    ];
  }
  return [
    { id: "c-1", title: "Soft Reset", subtitle: "A gentle restart with new ordering." },
    { id: "c-2", title: "Color Echo", subtitle: "A subtle color cue that evolves." },
    { id: "c-3", title: "Next Door", subtitle: "A nearby-feel slot (privacy-safe stub)." },
  ];
}

export type FypVariantKey = "A" | "B" | "C";

export function dayKeyUTC(ts: number = Date.now()): string {
  const d = new Date(ts);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Deterministic, stable "repeat session" variant.
 * Same seed+day => same variant.
 */
export function computeVariantForToday(seed: string, day: string = dayKeyUTC()): FypVariantKey {
  const s = `${seed}::${day}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % 3;
  return (idx === 0 ? "A" : idx === 1 ? "B" : "C");
}

export function getOrCreateFypSeed(): string {
  if (typeof window === "undefined") return "server";
  const k = "lumora.fyp.seed.v1";
  let v = window.localStorage.getItem(k);
  if (!v) {
    v = `seed_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(k, v);
  }
  return v;
}


// Canonical variant lookup keyed by variant key
export const VARIANTS: Record<string, { key: string }> = {
  "A": { key: "A" },
  "B": { key: "B" },
  "C": { key: "C" },
};
