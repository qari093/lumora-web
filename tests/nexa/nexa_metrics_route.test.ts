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

describe("NEXA metrics route handler", () => {
  it("GET returns 200 + ok:true payload + rl headers", async () => {
    const mod = await import("../../app/api/nexa/metrics/route");
    const res: Response = mod.GET() as any;

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") || "").toContain("application/json");
    expect(res.headers.get("cache-control") || "").toContain("no-store");
    expect(res.headers.get("x-nexa-metrics") || "").toBe("1");

    // soft rate limit headers
    expect(res.headers.get("x-ratelimit-limit")).toBeTruthy();
    expect(res.headers.get("x-ratelimit-remaining")).toBeTruthy();
    expect(res.headers.get("x-ratelimit-reset")).toBeTruthy();

    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
