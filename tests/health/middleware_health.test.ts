import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "../_helpers/ensureServer";

/**
 * This test enforces that the health endpoint is reachable and does not get
 * rewritten by middleware in unexpected ways.
 *
 * We keep it deterministic:
 * - never rely on BASE_URL="/"
 * - never pass AbortSignal to undici fetch in tests (handled elsewhere)
 * - always wait for /api/health to become reachable before assertions
 */

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForOk(url: string, maxMs: number) {
  const start = Date.now();
  let last = "unknown";
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return res;
      last = `status:${res.status}`;
    } catch (e: any) {
      last = typeof e?.message === "string" ? e.message : "fetch_error";
    }
    await sleep(250);
  }
  throw new Error(`waitForOk_timeout:${maxMs}ms last=${last}`);
}

const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

beforeAll(async () => {
  // Boot the dev server (shared helper) and then wait for /api/health
  await ensureServer({ timeoutMs: 90_000 }, 90_000);
  await waitForOk(String(new URL("/api/health", BASE)), 90_000);
}, 120_000);

afterAll(async () => {
  await shutdownServer();
});

describe("health middleware rewrite — minimal suite guard (auto)", () => {
  it("GET /api/health returns JSON and is not rewritten", async () => {
    const url = String(new URL("/api/health", BASE));
    const res = await waitForOk(url, 30_000);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(ct.includes("application/json")).toBe(true);
    // Next middleware rewrites (if present) often set this header; health should not.
    expect(res.headers.get("x-middleware-rewrite")).toBeFalsy();
    expect(text.length).toBeGreaterThan(2);
  });
});
