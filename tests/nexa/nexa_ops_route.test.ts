import { describe, it, expect, vi } from "vitest";

vi.mock("next/server", () => {
  class MockHeaders {
    private m = new Map<string, string>();
    set(k: string, v: string) { this.m.set(k.toLowerCase(), v); }
    get(k: string) { return this.m.get(k.toLowerCase()) ?? null; }
  }
  class MockNextResponse {
    headers = new MockHeaders();
    status: number;
    body: any;
    constructor(body: any, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }
    static json(body: any, init?: { status?: number }) { return new MockNextResponse(body, init); }
  }
  return { NextResponse: MockNextResponse };
});

vi.mock("../../lib/nexa/ops_snapshot", () => {
  return {
    readNexaOpsSnapshot: vi.fn(async () => ({ ok: true, ts: 1, source: "/tmp/x", data: { hello: "world" } })),
  };
});

describe("NEXA ops route", () => {
  it("returns x-nexa-ops header", async () => {
    const { GET } = await import("../../app/api/nexa/ops/route");
    const res: any = await GET({
        url: "http://localhost/api/nexa/ops",
      } as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("x-nexa-ops")).toBe("1");
  });
});
