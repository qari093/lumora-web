import { describe, expect, test, beforeAll } from "vitest";

const DEFAULT_PORT = Number.parseInt(process.env.PORT ?? "3000", 10) || 3000;
const BASE =
  process.env.NEXT_TEST_BASE_URL ||
  `http://127.0.0.1:${DEFAULT_PORT}`;

async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForHealthy(base: string, timeoutMs = 120_000) {
  const started = Date.now();
  let last = "init";
  while (Date.now() - started < timeoutMs) {
    try {
      const r = await fetch(`${base}/api/health`, { cache: "no-store" as any });
      last = `http:${r.status}`;
      if (r.status === 200) {
        // ensure JSON-ish
        const ct = r.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) return;
        // some setups may not set content-type; accept if body parses
        const t = await r.text();
        try { JSON.parse(t); return; } catch { /* keep waiting */ }
      }
    } catch (e: any) {
      last = String(e?.message || "fetch_error");
    }
    await delay(500);
  }
  throw new Error(`server not ready on ${base} (last=${last})`);
}

async function get(path: string, timeoutMs = 20_000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${BASE}${path}`, {
      cache: "no-store" as any,
      signal: ctrl.signal,
    });
    const text = await r.text();
    return { r, text };
  } finally {
    clearTimeout(to);
  }
}

beforeAll(async () => {
  await waitForHealthy(BASE, 120_000);
});

describe("create — RSC markers", () => {
  test("server is healthy", async () => {
    const { r, text } = await get("/api/health", 20_000);
    expect(r.status).toBe(200);
    expect(text.length).toBeGreaterThan(2);
  });

  test("create portal loads (status only)", async () => {
    const { r } = await get("/create", 25_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/publish loads (status only)", async () => {
    const { r } = await get("/create/publish", 25_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/upload loads (status only)", async () => {
    const { r } = await get("/create/upload", 25_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/record loads (status only)", async () => {
    const { r } = await get("/create/record", 25_000);
    expect([200, 307, 308]).toContain(r.status);
  });
});
