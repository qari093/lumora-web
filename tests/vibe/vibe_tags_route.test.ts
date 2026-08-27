import { describe, it, expect, vi } from "vitest";

vi.mock("../../lib/flags/vibeTags", async () => {
  const actual: any = await vi.importActual("../../lib/flags/vibeTags");
  return {
    ...actual,
    vibeTagsLiteEnabled: () => true,
    isVibeTagsLiteEnabled: () => true,
    isVibeTagsEnabled: () => true,
    getVibeTagsLiteEnabled: () => true,
  };
});

describe("Vibe Tags Lite: tags route (in-process)", () => {
  it("returns ok with items array", async () => {
    const route = await import("../../app/api/vibe/tags/route");
    const res = await route.GET();
    expect(res.status).toBeGreaterThanOrEqual(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
  });

  it("clamps limit", async () => {
    const route = await import("../../app/api/vibe/tags/route");
    const res = await route.GET();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.items.length).toBeLessThanOrEqual(200);
  });
});
