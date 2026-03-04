import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("Portals status route (in-process)", () => {
  const ORIG = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIG };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...ORIG };
    vi.resetModules();
  });

  it("returns 200 ok:true with items", async () => {
    const mod = await import("../../app/api/portals/status/route");
    const res = await mod.GET(new Request("http://localhost/api/portals/status"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeGreaterThan(0);
    expect(json.counts.total).toBe(json.items.length);
  });

  it("debug=1 includes env snapshot", async () => {
    process.env.LUMORA_PORTAL_FYP_ENABLED = "1";
    const mod = await import("../../app/api/portals/status/route");
    const res = await mod.GET(new Request("http://localhost/api/portals/status?debug=1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.debug).toBeTruthy();
    expect(json.debug.env).toBeTruthy();
    expect(json.debug.env.LUMORA_PORTAL_FYP_ENABLED).toBe("1");
  });

  it("env can disable a portal", async () => {
    process.env.LUMORA_PORTAL_MOVIES_ENABLED = "0";
    const mod = await import("../../app/api/portals/status/route");
    const res = await mod.GET(new Request("http://localhost/api/portals/status"));
    const json = await res.json();
    const movies = json.items.find((x: any) => x.key === "movies");
    expect(movies).toBeTruthy();
    expect(movies.enabled).toBe(false);
    expect(movies.note).toBe("disabled_by_env_or_default");
  });
});
