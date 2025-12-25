"use client";

type CrashState = {
  v: 1;
  failures: number;
  lastAt: string;
  disabledUntil?: string | null;
};

const KEY = "lumora:splash_crash_guard:v1";

function isoNow() {
  return new Date().toISOString();
}

export function loadCrashState(): CrashState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const j = JSON.parse(raw);
    if (!j || j.v !== 1) return null;
    return j as CrashState;
  } catch {
    return null;
  }
}

export function noteCrashFailure(): CrashState {
  const cur = loadCrashState() || { v: 1, failures: 0, lastAt: isoNow(), disabledUntil: null };
  const next: CrashState = {
    v: 1,
    failures: Math.min(10, (cur.failures || 0) + 1),
    lastAt: isoNow(),
    disabledUntil: cur.disabledUntil || null,
  };

  // If 2 consecutive failures, disable splash for 24h
  if (next.failures >= 2) {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    next.disabledUntil = d.toISOString();
  }

  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  return next;
}

export function clearCrashFailures() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function isSplashDisabled(): boolean {
  const st = loadCrashState();
  if (!st?.disabledUntil) return false;
  const until = Date.parse(st.disabledUntil);
  if (!Number.isFinite(until)) return false;
  return Date.now() < until;
}
