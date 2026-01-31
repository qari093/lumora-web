import { describe, expect, test } from "vitest";


function __timeoutPromise(ms: number): Promise<never> {
  return new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout:${ms}ms`)), ms));
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number): Promise<Response> {
  // Avoid AbortSignal instance mismatch (undici fetch vs jsdom/happy-dom signals) by not passing "signal".
  const safeInit: RequestInit = { ...init };
  // @ts-expect-error - ensure signal removed even if typed
  delete (safeInit as any).signal;
  return (await Promise.race([fetch(input, safeInit), __timeoutPromise(timeoutMs)])) as Response;
}

const PORT = process.env.PORT ?? "8088";
const BASE = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000");
const HEALTH_TIMEOUT_MS = Number(process.env.LUMORA_HEALTH_TEST_TIMEOUT_MS || 30000);

async function get(path: string, timeoutMs = 8000) {
  try {
    const res = await fetchWithTimeout(new URL(path, BASE), {
cache: "no-store",
}, timeoutMs);
    const text = await res.text();
    return { res, text };
  } finally {
  }
}

describe("middleware header contract (integration)", () => {
  test(
    "/api/_health returns JSON",
    async () => {
      const { res, text } = await get("/api/_health", 12000);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type") ?? "").toContain("application/json");
      const j = JSON.parse(text) as Record<string, unknown>;
      expect(typeof j.ok).toBe("boolean");
    },
    20000
  );

  test(
    "/api/health does not include x-middleware-rewrite header",
    async () => {
      const { res, text } = await get("/api/health", 12000);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type") ?? "").toContain("application/json");
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
      const j = JSON.parse(text) as Record<string, unknown>;
      expect(typeof j.ok).toBe("boolean");
    },
    20000
  );
});
