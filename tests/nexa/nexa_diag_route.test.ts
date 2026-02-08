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

describe("NEXA diag route handler", () => {
  it("GET returns 200 + ok:true + health+metrics objects (no 500)", async () => {
    const mod = await import("../../app/api/nexa/diag/route");
    expect(typeof mod.GET).toBe("function");

    const res: Response = mod.GET() as any;

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") || "").toContain("application/json");
    expect(res.headers.get("cache-control") || "").toContain("no-store");
    expect(res.headers.get("x-nexa-diag") || "").toBe("1");

    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(typeof json.ts).toBe("number");
    expect(json.ts).toBeGreaterThan(0);

    expect(json.health).toBeTruthy();
    expect(typeof json.health.ok).toBe("boolean");

    expect(json.metrics).toBeTruthy();
    expect(typeof json.metrics.ok).toBe("boolean");
  });
});
