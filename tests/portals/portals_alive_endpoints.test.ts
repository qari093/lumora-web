import { describe, it, expect } from "vitest";

describe("Portals (user-alive) — alive endpoints", () => {
  it("/api/portals/status never throws and returns ok:true", async () => {
    const mod = await import("../../app/api/portals/status/route");
    const GET = (mod as any).GET;
    expect(typeof GET).toBe("function");

    const req = new Request("http://localhost/api/portals/status", { method: "GET" });
    const res: Response = await GET(req);

    expect([200, 400, 403]).toContain(res.status);
    expect(res.headers.get("content-type") || "").toMatch(/application\/json/i);

    const body = await res.json();
    expect(body).toBeTruthy();
    expect(body.ok).toBe(true);
    expect(typeof body.ts).toBe("number");
    expect(body.ts).toBeGreaterThan(0);
    // allow flexible payload, but must be inspectable + non-500 ergonomics
  });

  it("/api/vibe/status returns ok:true + enabled boolean (sanity)", async () => {
    const mod = await import("../../app/api/vibe/status/route");
    const GET = (mod as any).GET;
    expect(typeof GET).toBe("function");

    const req = new Request("http://localhost/api/vibe/status", { method: "GET" });
    const res: Response = await GET(req);

    expect([200, 400, 403]).toContain(res.status);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.enabled).toBe("boolean");
  });
});
