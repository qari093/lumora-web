import { describe, it, expect, vi } from "vitest";

vi.mock("../../lib/flags/vibeTags", async () => {
  const actual: any = await vi.importActual("../../lib/flags/vibeTags");
  return { ...actual, vibeTagsLiteEnabled: () => true };
});

describe("Vibe Tags Lite: my-recent route (in-process)", () => {
  it("requires userId", async () => {
    const route = await import("../../app/api/vibe/my-recent/route");
    const req = new Request("http://localhost/api/vibe/my-recent?limit=10");
    const res = await route.GET(req as any);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error).toBe("userId_required");
  });

  it("returns ok with items array (empty allowed)", async () => {
    const route = await import("../../app/api/vibe/my-recent/route");
    const req = new Request("http://localhost/api/vibe/my-recent?userId=me&limit=5");
    const res = await route.GET(req as any);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`unexpected_status=${res.status} json=${JSON.stringify(json)}`);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
  });

  it("clamps limit", async () => {
    const route = await import("../../app/api/vibe/my-recent/route");
    const req = new Request("http://localhost/api/vibe/my-recent?userId=me&limit=9999");
    const res = await route.GET(req as any);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`unexpected_status=${res.status} json=${JSON.stringify(json)}`);
    expect(json.ok).toBe(true);
    expect(json.limit).toBe(100);
    expect(Array.isArray(json.items)).toBe(true);
  });
});
