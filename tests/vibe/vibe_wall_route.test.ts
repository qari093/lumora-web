import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../lib/flags/vibeTags", async () => {
  const actual: any = await vi.importActual("../../lib/flags/vibeTags");
  return { ...actual, vibeTagsLiteEnabled: () => true };
});

const previousVibeFlag =
  process.env.VIBE_TAGS_LITE_ENABLED;

beforeEach(() => {
  process.env.VIBE_TAGS_LITE_ENABLED = "true";
});

afterEach(() => {
  if (previousVibeFlag === undefined) {
    delete process.env.VIBE_TAGS_LITE_ENABLED;
  } else {
    process.env.VIBE_TAGS_LITE_ENABLED =
      previousVibeFlag;
  }
});

describe("Vibe Tags Lite: wall route (in-process)", () => {
  it("requires userId", async () => {
    const route = await import("../../app/api/vibe/wall/route");
    const req = new Request("http://localhost/api/vibe/wall");
    const res = await route.GET(req as any);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error).toBe("userId_required");
  });

  it("returns ok with items array (empty allowed)", async () => {
    const route = await import("../../app/api/vibe/wall/route");
    const req = new Request("http://localhost/api/vibe/wall?userId=me&limit=5");
    const res = await route.GET(req as any);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`unexpected_status=${res.status} json=${JSON.stringify(json)}`);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
  });

  it("clamps limit", async () => {
    const route = await import("../../app/api/vibe/wall/route");
    const req = new Request("http://localhost/api/vibe/wall?userId=me&limit=9999");
    const res = await route.GET(req as any);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`unexpected_status=${res.status} json=${JSON.stringify(json)}`);
    expect(json.ok).toBe(true);
    expect(json.limit).toBe(100);
  });
});
