"use client";

export type SplashGuardDecision = {
  version: 1;
  decidedAt: string;
  phase: "skipped" | "timed_out" | "done";
  reason: string;
};

const KEY = "lumora:splash_guard:v1";

export function loadSplashGuard(): SplashGuardDecision | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const json = JSON.parse(raw);
    if (json && json.version === 1) return json as SplashGuardDecision;
    return null;
  } catch {
    return null;
  }
}

export function saveSplashGuard(decision: Omit<SplashGuardDecision, "version" | "decidedAt">) {
  try {
    const payload: SplashGuardDecision = {
      version: 1,
      decidedAt: new Date().toISOString(),
      phase: decision.phase,
      reason: decision.reason,
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function clearSplashGuard() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
