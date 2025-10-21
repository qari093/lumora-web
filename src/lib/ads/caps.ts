export type CapVerdict = {
  allowed: boolean;
  reason?: "COOLDOWN" | "HOURLY_CAP" | "DAILY_CAP";
  retryAfterMs?: number;
  meta: { last?: number; hourHits: number; dayHits: number; hourResetAt: number; dayResetAt: number };
};

declare global {
  // eslint-disable-next-line no-var
  var __AD_CAPS: Map<string, { last: number; hourHits: number; dayHits: number; hourStart: number; dayStart: number }> | undefined;
}

const store: Map<string, { last: number; hourHits: number; dayHits: number; hourStart: number; dayStart: number }> =
  (globalThis.__AD_CAPS ||= new Map());

const COOLDOWN_MS = 8_000;      // min gap between serves to same IP+owner
const MAX_PER_HOUR = 30;        // dev defaults; tune later
const MAX_PER_DAY  = 200;       // dev defaults; tune later

export function checkCaps(key: string, now = Date.now()): CapVerdict {
  const hourMs = 3_600_000;
  const dayMs  = 86_400_000;
  let rec = store.get(key);
  if (!rec) {
    rec = { last: 0, hourHits: 0, dayHits: 0, hourStart: now, dayStart: now };
    store.set(key, rec);
  }
  // rotate hour/day windows
  if (now - rec.hourStart >= hourMs) { rec.hourStart = now; rec.hourHits = 0; }
  if (now - rec.dayStart  >= dayMs)  { rec.dayStart  = now; rec.dayHits  = 0; }

  // apply limits
  if (now - rec.last < COOLDOWN_MS) {
    return { allowed: false, reason: "COOLDOWN", retryAfterMs: COOLDOWN_MS - (now - rec.last), meta: toMeta(rec) };
  }
  if (rec.hourHits >= MAX_PER_HOUR) {
    const resetAt = rec.hourStart + hourMs;
    return { allowed: false, reason: "HOURLY_CAP", retryAfterMs: Math.max(0, resetAt - now), meta: toMeta(rec) };
  }
  if (rec.dayHits >= MAX_PER_DAY) {
    const resetAt = rec.dayStart + dayMs;
    return { allowed: false, reason: "DAILY_CAP", retryAfterMs: Math.max(0, resetAt - now), meta: toMeta(rec) };
  }
  // consume
  rec.last = now;
  rec.hourHits += 1;
  rec.dayHits  += 1;
  return { allowed: true, meta: toMeta(rec) };
}

function toMeta(rec: { last: number; hourHits: number; dayHits: number; hourStart: number; dayStart: number }) {
  const hourMs = 3_600_000; const dayMs = 86_400_000;
  return {
    last: rec.last,
    hourHits: rec.hourHits,
    dayHits: rec.dayHits,
    hourResetAt: rec.hourStart + hourMs,
    dayResetAt: rec.dayStart + dayMs,
  };
}
