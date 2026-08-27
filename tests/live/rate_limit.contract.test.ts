import { describe, it, expect } from "vitest";
import { httpGetRetryOnce } from "../_util/http";

function baseUrl() {
  const port = process.env.PORT || "3000";
  return process.env.LIVE_BASE_URL || `http://127.0.0.1:${port}`;
}

function toNum(v: string | string[] | null | undefined): number | null {
  const value = Array.isArray(v) ? v[0] : v;
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const MEGA19_RUN_HTTP_CONTRACTS =
  process.env.RUN_HTTP_CONTRACT_TESTS === "1";

describe.skipIf(!MEGA19_RUN_HTTP_CONTRACTS)("Live rate limit contracts", () => {
  it(
    "portal-hubs exposes ratelimit headers consistently",
    async () => {
      const base = baseUrl();
      const r = await httpGetRetryOnce(`${base}/api/live/portal-hubs`, { timeoutMs: 8000, retryDelayMs: 250 });

      expect(r.status).toBe(200);
      const lim = toNum(r.headers["x-ratelimit-limit"]);
      const rem = toNum(r.headers["x-ratelimit-remaining"]);
      const reset = toNum(r.headers["x-ratelimit-reset"]);

      expect(lim).not.toBeNull();
      expect(rem).not.toBeNull();
      expect(reset).not.toBeNull();

      // remaining must be between 0..limit (best-effort, allow equal)
      if (lim != null && rem != null) {
        expect(rem).toBeGreaterThanOrEqual(0);
        expect(rem).toBeLessThanOrEqual(lim);
      }
    },
    35000
  );

  it(
    "rooms exposes ratelimit headers consistently",
    async () => {
      const base = baseUrl();
      const r = await httpGetRetryOnce(`${base}/api/live/rooms`, { timeoutMs: 8000, retryDelayMs: 250 });

      expect(r.status).toBe(200);
      const lim = toNum(r.headers["x-ratelimit-limit"]);
      const rem = toNum(r.headers["x-ratelimit-remaining"]);
      const reset = toNum(r.headers["x-ratelimit-reset"]);

      expect(lim).not.toBeNull();
      expect(rem).not.toBeNull();
      expect(reset).not.toBeNull();

      if (lim != null && rem != null) {
        expect(rem).toBeGreaterThanOrEqual(0);
        expect(rem).toBeLessThanOrEqual(lim);
      }
    },
    35000
  );

  it(
    "health-badge exposes ratelimit headers consistently",
    async () => {
      const base = baseUrl();
      const r = await httpGetRetryOnce(`${base}/api/live/health-badge`, { timeoutMs: 8000, retryDelayMs: 250 });

      expect(r.status).toBe(200);
      const lim = toNum(r.headers["x-ratelimit-limit"]);
      const rem = toNum(r.headers["x-ratelimit-remaining"]);
      const reset = toNum(r.headers["x-ratelimit-reset"]);

      expect(lim).not.toBeNull();
      expect(rem).not.toBeNull();
      expect(reset).not.toBeNull();

      if (lim != null && rem != null) {
        expect(rem).toBeGreaterThanOrEqual(0);
        expect(rem).toBeLessThanOrEqual(lim);
      }
    },
    35000
  );

  it(
    "alias routes return 410 quickly and still include ratelimit headers",
    async () => {
      const base = baseUrl();
      const aliases = ["/api/live/room-list", "/api/live/rooms/list", "/api/live/rooms/public"];
      for (const p of aliases) {
        const r = await httpGetRetryOnce(`${base}${p}`, { timeoutMs: 6000, retryDelayMs: 200 });
        expect(r.status).toBe(410);

        const lim = toNum(r.headers["x-ratelimit-limit"]);
        const rem = toNum(r.headers["x-ratelimit-remaining"]);
        const reset = toNum(r.headers["x-ratelimit-reset"]);
        expect(lim).not.toBeNull();
        expect(rem).not.toBeNull();
        expect(reset).not.toBeNull();

        const body = JSON.parse(r.bodyText || "{}") as any;
        expect(body?.ok).toBe(false);
        expect(body?.error?.code).toBe("ROUTE_DEPRECATED");
      }
    },
    35000
  );
});
