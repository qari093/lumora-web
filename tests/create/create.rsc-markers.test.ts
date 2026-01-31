import { describe, expect, test, beforeAll } from "vitest";

const DEFAULT_PORT = Number.parseInt(process.env.PORT ?? "3000", 10) || 3000;
const BASE =
  process.env.NEXT_TEST_BASE_URL ||
  process.env.LUMORA_BASE_URL ||
  `http://127.0.0.1:${DEFAULT_PORT}`;

async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function withTimeout<T>(p: Promise<T>, ms: number, label = "timeout") {
  let t: any;
  const timeout = new Promise<T>((_, rej) => {
    t = setTimeout(() => rej(new Error(label)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t);
  }
}

async function waitForHealthy(base: string, timeoutMs = 120_000) {
  const started = Date.now();
  let last = "init";
  while (Date.now() - started < timeoutMs) {
    try {
      const r = await withTimeout(fetch(`${base}/api/health`, { cache: "no-store" as any }), 10_000, "health_fetch_timeout");
      last = `http:${r.status}`;
      if (r.status === 200) {
        const ct = r.headers.get("content-type") ?? "";
        const text = await withTimeout(r.text(), 10_000, "health_body_timeout");
        if (ct.includes("application/json")) return;
        try { JSON.parse(text); return; } catch { /* keep waiting */ }
      }
    } catch (e: any) {
      last = String(e?.message || "fetch_error");
    }
    await delay(500);
  }
  throw new Error(`server not ready on ${base} (last=${last})`);
}

async function get(path: string, timeoutMs = 25_000) {
  const r = await withTimeout(fetch(`${BASE}${path}`, { cache: "no-store" as any }), timeoutMs, `get_timeout:${path}`);
  const text = await withTimeout(r.text(), timeoutMs, `body_timeout:${path}`);
  return { r, text };
}

beforeAll(async () => {
  await waitForHealthy(BASE, 120_000);
});

describe("create — RSC markers", () => {
  test("server is healthy", async () => {
    const { r, text } = await get("/api/health", 25_000);
    expect(r.status).toBe(200);
    expect(text.length).toBeGreaterThan(2);
  });

  test("create portal loads (status only)", async () => {
    const { r } = await get("/create", 30_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/publish loads (status only)", async () => {
    const { r } = await get("/create/publish", 30_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/upload loads (status only)", async () => {
    const { r } = await get("/create/upload", 30_000);
    expect([200, 307, 308]).toContain(r.status);
  });

  test("create/record loads (status only)", async () => {
    const { r } = await get("/create/record", 30_000);
    expect([200, 307, 308]).toContain(r.status);
  });
});
