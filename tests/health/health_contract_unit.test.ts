import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";

function isIsoString(value: unknown): boolean {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)
  );
}

async function readJson(res: Response): Promise<Record<string, any>> {
  const contentType = res.headers.get("content-type") ?? "";
  expect(contentType).toContain("application/json");

  const text = await res.text();
  expect(text.length).toBeGreaterThan(0);

  return JSON.parse(text) as Record<string, any>;
}

describe("health API contract (unit)", () => {
  test("GET /api/health returns canonical runtime metadata contract", async () => {
    const mod = await import("../../app/api/health/route");

    expect(typeof mod.GET).toBe("function");

    const res: Response = await mod.GET();

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");

    const body = await readJson(res);

    expect(body.ok).toBe(true);
    expect(body.status).toBe("healthy");
    expect(body.route).toBe("/api/health");
    expect(body.service).toBe("lumora-web");
    expect(typeof body.version).toBe("string");
    expect(typeof body.appEnv).toBe("string");
    expect(
      body.commitSha === null || typeof body.commitSha === "string",
    ).toBe(true);
    expect(
      body.deploymentId === null || typeof body.deploymentId === "string",
    ).toBe(true);
    expect(isIsoString(body.checkedAt)).toBe(true);

    expect("ts" in body).toBe(false);
    expect("node" in body).toBe(false);
    expect("env" in body).toBe(false);
    expect("deep" in body).toBe(false);
    expect("checks" in body).toBe(false);
    expect("timeout_ms" in body).toBe(false);
    expect("base_url" in body).toBe(false);
  });

  test("GET /api/healthz returns canonical lightweight liveness contract", async () => {
    const mod = await import("../../app/api/healthz/route");

    expect(typeof mod.GET).toBe("function");

    const res: Response = await mod.GET();

    expect(res.status).toBe(200);

    const body = await readJson(res);

    expect(body).toEqual({
      ok: true,
      service: "lumora",
      route: "/api/healthz",
    });
    expect("ts" in body).toBe(false);
  });

  test("GET /api/emml/health returns EMML health contract", async () => {
    const mod = await import("../../app/api/emml/health/route");

    expect(typeof mod.GET).toBe("function");

    const res: Response = await mod.GET();

    expect(res.status).toBe(200);

    const body = await readJson(res);

    expect(body.ok).toBe(true);
    expect(body.system).toBe("emml");
    expect(body.status).toBe("healthy");
    expect(isIsoString(body.asOf)).toBe(true);
  });

  test("GET /api/hybrid/health returns hybrid health contract", async () => {
    const mod = await import("../../app/api/hybrid/health/route");

    expect(typeof mod.GET).toBe("function");

    const res: Response = await mod.GET();

    expect(res.status).toBe(200);

    const body = await readJson(res);

    expect(body.ok).toBe(true);
    expect(body.service).toBe("hybrid-core");
    expect(isIsoString(body.time)).toBe(true);
  });

  test("GET /api/ads/health returns ads health contract", async () => {
    const mod = await import("../../app/api/ads/health/route");

    expect(typeof mod.GET).toBe("function");

    const request = new NextRequest("http://localhost:8088/api/ads/health");
    const res: Response = await mod.GET(request);

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");

    const body = await readJson(res);

    expect(body.ok).toBe(true);
    expect(body.service).toBe("lumora");
    expect(body.system).toBe("ads");
    expect(body.route).toBe("/api/ads/health");
    expect(isIsoString(body.ts)).toBe(true);
  });
});
