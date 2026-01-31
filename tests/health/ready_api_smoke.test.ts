import { describe, it, expect } from "vitest";


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

const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";

async function fetchJson(url: string, timeoutMs = 15000) {
  try {
    const r = await fetchWithTimeout(url, {
redirect: "follow",
}, timeoutMs);
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const txt = await r.text();
    let j: any = null;
    try { j = JSON.parse(txt); } catch { j = null; }
    return { r, ct, txt, j };
  } finally {
  }
}

describe("/api/ready smoke", () => {
  it(
    "returns 200 and JSON-ish body",
    async () => {
      const { r, ct, txt, j } = await fetchJson(`${base}/api/ready`, 15000);
      expect(r.status).toBe(200);
      expect(ct).toContain("application/json");
      expect(j).not.toBe(null);
      expect(typeof j).toBe("object");
      expect(txt.length).toBeGreaterThan(1);
    },
    20000
  );
});
