import { describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => {
  class NextResponse {
    static json(body: any, init?: { status?: number; headers?: Record<string, string> }) {
      const status = init?.status ?? 200;
      const headers = new Headers(init?.headers ?? {});
      if (!headers.get("content-type")) headers.set("content-type", "application/json; charset=utf-8");
      return new Response(JSON.stringify(body), { status, headers });
    }
  }
  return { NextResponse };
});

describe("NEXA index route handler", () => {
  it("GET returns 200 + routes list", async () => {
    const mod = await import("../../app/api/nexa/route");
    const res: Response = mod.GET() as any;

    expect(res.status).toBe(200);
    expect(res.headers.get("x-nexa-index") || "").toBe("1");

    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.service).toBe("nexa");
    expect(Array.isArray(json.routes)).toBe(true);
    expect(json.routes.length).toBeGreaterThanOrEqual(5);

    const paths = new Set(json.routes.map((r: any) => r.path));
    expect(paths.has("/api/nexa/health")).toBe(true);
    expect(paths.has("/api/nexa/metrics")).toBe(true);
    expect(paths.has("/api/nexa/diag")).toBe(true);
    expect(paths.has("/api/nexa/info")).toBe(true);
    expect(paths.has("/api/nexa")).toBe(true);
  });
});
