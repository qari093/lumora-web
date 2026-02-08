export type NexaRateLimitHint = {
  limit: number;
  remaining: number;
  resetSec: number;
};

export function getNexaRateLimitHint(): NexaRateLimitHint {
  // Soft hints only (no enforcement). Hard RL can be added later with real storage.
  // Defaults are conservative and can be configured via env.
  const limit = Number(process.env.NEXA_RL_LIMIT ?? 120);
  const windowSec = Number(process.env.NEXA_RL_WINDOW_SEC ?? 60);

  const lim = Number.isFinite(limit) && limit > 0 ? limit : 120;
  const win = Number.isFinite(windowSec) && windowSec > 0 ? windowSec : 60;

  // No per-client tracking yet => treat remaining==limit.
  const now = Math.floor(Date.now() / 1000);
  const resetSec = now - (now % win) + win;

  return { limit: lim, remaining: lim, resetSec };
}

export function rateLimitHeaders() {
  const h = getNexaRateLimitHint();
  return {
    "x-ratelimit-limit": String(h.limit),
    "x-ratelimit-remaining": String(h.remaining),
    "x-ratelimit-reset": String(h.resetSec),
  } as Record<string, string>;
}
