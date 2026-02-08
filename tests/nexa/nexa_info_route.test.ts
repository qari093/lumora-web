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

describe("NEXA info route handler", () => {
  it("GET returns 200 + ok:true + service/env/node fields", async () => {
    const mod = await import("../../app/api/nexa/info/route");
    const res: Response = mod.GET() as any;

    expect(res.status).toBe(200);
    expect(res.headers.get("x-nexa-info") || "").toBe("1");

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("nexa");
    expect(typeof json.ts).toBe("number");
    expect(json.ts).toBeGreaterThan(0);

    expect(json.node).toBeTruthy();
    expect(typeof json.node.version).toBe("string");
    expect(json.node.version.length).toBeGreaterThan(0);

    expect(json.app).toBeTruthy();
    expect(typeof json.app.env).toBe("string");
    expect(json.app.env.length).toBeGreaterThan(0);
  });
});
