import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Vibe Tags Lite: status route (in-process)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("returns ok + enabled boolean", async () => {
    const route = await import("../../app/api/vibe/status/route");
    const req = new Request("http://localhost/api/vibe/status");
    const res = await route.GET(req as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(typeof json.enabled).toBe("boolean");
  });

  it("debug=1 returns env snapshot keys", async () => {
    process.env.LUMORA_VIBE_TAGS_LITE = "1";
    vi.resetModules();

    const route = await import("../../app/api/vibe/status/route");
    const req = new Request("http://localhost/api/vibe/status?debug=1");
    const res = await route.GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json).toHaveProperty("env");
    expect(json.env).toHaveProperty("LUMORA_VIBE_TAGS_LITE");
    expect(json.env).toHaveProperty("NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE");
  });
});
