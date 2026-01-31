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

async function fetchJson(url: string, timeoutMs = 15000) {
  try {
    const r = await fetchWithTimeout(url, {}, timeoutMs);
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const txt = await r.text();
    let j: any = null;
    try {
      j = JSON.parse(txt);
    } catch {
      j = null;
    }
    return { r, ct, txt, j };
  } finally {
  }
}

describe("/api/version smoke", () => {
  it(
    "returns 200 and JSON with ok/service/version fields",
    async () => {
      const base = process.env.LUMORA_BASE_URL || "http://127.0.0.1:3000";
      const { r, ct, j, txt } = await fetchJson(`${base}/api/version`, 20000);
      expect(r.status).toBe(200);
      expect(ct).toContain("application/json");
      expect(j).not.toBe(null);
      expect(j.ok).toBe(true);
      expect(typeof j.service).toBe("string");
      expect(typeof j.version).toBe("string");
      expect(typeof j.commit).toBe("string");
      expect(typeof j.ts).toBe("number");
      if (!j || j.ok !== true) {
        throw new Error(`Unexpected body: ${txt.slice(0, 400)}`);
      }
    },
    25000
  );
});
