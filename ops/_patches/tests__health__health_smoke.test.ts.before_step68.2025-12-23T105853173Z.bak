import { describe, expect, test } from "vitest";

const PORT = Number(process.env.PORT ?? 8088);
const BASE = `http://127.0.0.1:${PORT}`;

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function getJson(path: string, timeoutMs: number): Promise<{ status: number; ct: string; text: string; json: any }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error(`abort:${timeoutMs}ms`)), timeoutMs);
  try {
    const res = await fetch(new URL(path, BASE), { cache: "no-store", signal: ac.signal });
    const ct = res.headers.get("content-type") ?? "";
    const text = await res.text();
    const json = ct.includes("application/json") ? JSON.parse(text) : null;
    return { status: res.status, ct, text, json };
  } finally {
    clearTimeout(t);
  }
}

async function retry<T>(fn: () => Promise<T>, totalMs: number): Promise<T> {
  const start = Date.now();
  let attempt = 0;
  let lastErr: unknown = null;

  while (Date.now() - start < totalMs) {
    attempt++;
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      // exponential backoff with cap; add tiny jitter
      const backoff = Math.min(1200, 120 * Math.pow(1.6, attempt));
      await sleep(backoff + Math.floor(Math.random() * 120));
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr ?? "retry-timeout")));
}

describe("health smoke", () => {
  test(
    "/api/health responds and is json (smoke, robust)",
    async () => {
      // allow up to 25s total due to dev-server cold paths / busy CPU
      const out = await retry(
        async () => {
          const r = await getJson("/api/health", 6000);
          if (r.status !== 200) throw new Error(`status:${r.status}`);
          if (!r.ct.includes("application/json")) throw new Error(`ct:${r.ct}`);
          if (!r.json || r.json.ok !== true) throw new Error(`json:${r.text.slice(0, 120)}`);
          return r;
        },
        25000
      );

      expect(out.status).toBe(200);
      expect(out.ct).toContain("application/json");
      expect(out.json.ok).toBe(true);
      expect(out.json.route).toBe("/api/health");
    },
    30000
  );

  test(
    "/api/health?deep=1 does not hang",
    async () => {
      const out = await retry(
        async () => {
          const r = await getJson("/api/health?deep=1&timeout_ms=1200", 8000);
          if (r.status !== 200) throw new Error(`status:${r.status}`);
          if (!r.ct.includes("application/json")) throw new Error(`ct:${r.ct}`);
          if (!r.json || r.json.deep !== true) throw new Error(`json:${r.text.slice(0, 120)}`);
          return r;
        },
        25000
      );

      expect(out.status).toBe(200);
      expect(out.ct).toContain("application/json");
      expect(out.json.deep).toBe(true);
      expect(out.json.checks?.self_healthz).toBeTypeOf("object");
    },
    30000
  );
});
