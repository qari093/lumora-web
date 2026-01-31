import { describe, it, expect } from "vitest";


function __resolveTestBase(): string {
  const env = (process.env.TEST_BASE_URL || process.env.BASE_URL || "").trim();
  if (env && /^https?:\/\//i.test(env)) return env.replace(/\/$/, "");
  const port = (process.env.PORT || "3000").trim() || "3000";
  return `http://127.0.0.1:${port}`;
}

async function __fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  // Node/Vitest environment can have AbortSignal incompatibilities depending on undici/polyfills.
  // Use Promise.race timeout without passing "signal".
  const timeout = new Promise((_, rej) =>
    setTimeout(() => rej(new Error(`timeout:${timeoutMs}ms`)), timeoutMs)
  );
  return (await Promise.race([fetch(url, { redirect: "follow" }), timeout])) as Response;
}

const BASE = __resolveTestBase();

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(path: string, timeoutMs = 6_000) {
  const res = await __fetchWithTimeout(String(new URL(path, BASE)), timeoutMs);
  const text = await res.text();
  return { res, text };
}

async function ensureHealthWithin(maxWaitMs: number) {
  const start = Date.now();
  let lastErr = "unknown";
  while (Date.now() - start < maxWaitMs) {
    try {
      const { res, text } = await fetchText("/api/health", 10_000);
      if (res.ok) {
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          try {
            const j = JSON.parse(text);
            if (j && j.ok === true) return;
            lastErr = `health_json_not_ok:${text.slice(0, 140)}`;
          } catch {
            lastErr = `health_json_parse_fail:${text.slice(0, 140)}`;
          }
        } else {
          lastErr = `health_not_json:${ct}:${text.slice(0, 140)}`;
        }
      } else {
        lastErr = `health_status_${res.status}:${text.slice(0, 140)}`;
      }
    } catch (e: any) {
      lastErr = typeof e?.message === "string" ? e.message : "fetch_failed";
    }
    await sleep(350);
  }
  throw new Error(`Test server not healthy within ${maxWaitMs}ms. last=${lastErr}`);
}

describe("health smoke", () => {
  it(
    "/api/health responds and is json (smoke, robust)",
    async () => {
      // IMPORTANT: avoid beforeAll hooks entirely (hooks can hit global hookTimeout=30s).
      // Do readiness + assertion in the test itself (per-test timeout applies).
      await ensureHealthWithin(45_000);

      const { res, text } = await fetchText("/api/health", 8_000);
      expect(res.ok).toBe(true);

      const ct = res.headers.get("content-type") ?? "";
      expect(ct).toContain("application/json");

      const j = JSON.parse(text);
      expect(j.ok).toBe(true);
    },
    30_000
  );
});
