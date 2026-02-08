import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";

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

type Contract = {
  service: string;
  version: string;
  endpoints: Array<{ path: string; method: string; headers: string[]; shape: Record<string, string> }>;
};

function loadContract(): Contract {
  const raw = fs.readFileSync("docs/nexa/contracts.v1.json", "utf8");
  return JSON.parse(raw);
}

describe("NEXA contract (v1)", () => {
  it("contract file exists and declares endpoints", () => {
    const c = loadContract();
    expect(c.service).toBe("nexa");
    expect(c.version).toBe("v1");
    expect(Array.isArray(c.endpoints)).toBe(true);
    expect(c.endpoints.length).toBeGreaterThanOrEqual(5);
  });

  it("routes return required headers (mocked NextResponse)", async () => {
    // Map endpoint path to module import
    const map: Record<string, string> = {
      "/api/nexa/health": "../../app/api/nexa/health/route",
      "/api/nexa/metrics": "../../app/api/nexa/metrics/route",
      "/api/nexa/diag": "../../app/api/nexa/diag/route",
      "/api/nexa/info": "../../app/api/nexa/info/route",
      "/api/nexa": "../../app/api/nexa/route"
    };

    const c = loadContract();

    for (const ep of c.endpoints) {
      const modPath = map[ep.path];
      expect(modPath).toBeTruthy();

      const mod = await import(modPath);
      expect(typeof mod.GET).toBe("function");

      const res: Response = mod.GET() as any;

      // must always return JSON (health/info/metrics/index are 200; diag always 200)
      expect((res.headers.get("content-type") || "")).toContain("application/json");

      for (const h of ep.headers) {
        // case-insensitive header lookup
        const v = res.headers.get(h);
        expect(v, `missing header ${h} for ${ep.path}`).toBeTruthy();
      }
    }
  });
});
