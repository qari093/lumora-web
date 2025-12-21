import { describe, expect, test } from "vitest";

/**
 * These are UNIT contract tests (no server, no fetch).
 * They validate that our route handlers produce stable JSON shapes.
 *
 * NOTE: We call route GET handlers directly to avoid network flake.
 */

function isIsoString(s: unknown): boolean {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(s);
}

async function readJson(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") ?? "";
  expect(ct).toContain("application/json");
  const text = await res.text();
  expect(text.length).toBeGreaterThan(0);
  return JSON.parse(text);
}

describe("health API contract (unit)", () => {
  test("GET /api/health returns base contract", async () => {
    const mod = await import("../../app/api/health/route");
    expect(typeof mod.GET).toBe("function");
    const req = new Request("http://localhost:8088/api/health");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j).toBeTypeOf("object");
    expect(j.ok).toBe(true);
    expect(j.service).toBe("lumora-web");
    expect(j.route).toBe("/api/health");
    expect(isIsoString(j.ts)).toBe(true);
    expect(typeof j.node).toBe("string");
    expect(typeof j.env).toBe("string");
    expect("checks" in j).toBe(false);
  });

  test("GET /api/health?deep=1 returns deep contract with checks.self_healthz", async () => {
    const mod = await import("../../app/api/health/route");
    const req = new Request("http://localhost:8088/api/health?deep=1&timeout_ms=50");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j.ok).toBe(true);
    expect(j.deep).toBe(true);
    expect(typeof j.timeout_ms).toBe("number");
    expect(typeof j.base_url).toBe("string");
    expect(j.checks).toBeTypeOf("object");
    expect(j.checks.self_healthz).toBeTypeOf("object");
    expect(typeof j.checks.self_healthz.ok).toBe("boolean");
    expect("status" in j.checks.self_healthz).toBe(true);
    expect(
      typeof j.checks.self_healthz.status === "number" || j.checks.self_healthz.status === null
    ).toBe(true);
  });

  test("GET /api/healthz contract", async () => {
    const mod = await import("../../app/api/healthz/route");
    const req = new Request("http://localhost:8088/api/healthz");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j.ok).toBe(true);
    expect(typeof j.service).toBe("string");
    expect(typeof j.ts).toBe("number");
  });

  test("GET /api/emml/health contract", async () => {
    const mod = await import("../../app/api/emml/health/route");
    const req = new Request("http://localhost:8088/api/emml/health");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j.ok).toBe(true);
    expect(j.system).toBe("emml");
    expect(j.status).toBe("healthy");
    expect(typeof j.asOf).toBe("string");
  });

  test("GET /api/hybrid/health contract", async () => {
    const mod = await import("../../app/api/hybrid/health/route");
    const req = new Request("http://localhost:8088/api/hybrid/health");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j.ok).toBe(true);
    expect(j.service).toBe("hybrid-core");
    expect(typeof j.time).toBe("string");
  });

  test("GET /api/ads/health contract", async () => {
    const mod = await import("../../app/api/ads/health/route");
    const req = new Request("http://localhost:8088/api/ads/health");
    const res: Response = await mod.GET(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);

    expect(j.ok).toBe(true);
    expect(j.system).toBe("ads");
    expect(j.route).toBe("/api/ads/health");
    expect(typeof j.ts).toBe("string");
  });
});
