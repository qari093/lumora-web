import { describe, it, expect } from "vitest";

function __resolveTestBase(): string {
  const env = process.env.TEST_BASE_URL || process.env.BASE_URL || process.env.VERCEL_URL || "";
  if (env && env !== "/") return env.startsWith("http") ? env : `https://${env}`;
  const port = Number(process.env.PORT) || 3000;
  return `http://127.0.0.1:${port}`;
}

const BASE = __resolveTestBase();


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

async function fetchJson(url: string, timeoutMs = 30000) {
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


// LUMORA_HEALTH_WARMUP_V1
async function __warmup(url: string, maxMs: number) {
  const started = Date.now();
  let last = "unknown";
  while (Date.now() - started < maxMs) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      if (r.ok) return;
      last = `http:${r.status}`;
    } catch (e) {
      last = (e && (e as any).message) ? String((e as any).message) : "fetch_failed";
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  console.warn(`warmup_timeout:${maxMs}ms last=${last}`);
}
describe("/api/health smoke", () => {
    beforeAll(async () => { await __warmup(String(new URL("/api/health", BASE)), 45000); }, 45000);

it(
    "returns 200 and JSON-ish body",
    async () => {
      const { r, ct, txt, j } = await fetchJson(`${base}/api/health`, 30000);
      expect(r.status).toBe(200);
      expect(ct).toContain("application/json");
      expect(j).not.toBe(null);
      expect(typeof j).toBe("object");
      expect(txt.length).toBeGreaterThan(1);
    },
    20000
  );
});
