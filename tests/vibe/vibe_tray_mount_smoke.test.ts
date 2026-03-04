import { describe, it, expect, vi } from "vitest";

describe("VibeTrayMount smoke (flag gate)", () => {
  it("renders null when vibeTagsLiteEnabled() is false", async () => {
    vi.resetModules();

    vi.doMock("../../lib/flags/vibeTags", () => ({
      vibeTagsLiteEnabled: () => false,
    }));

    const mod = await import("../../components/vibe/VibeTrayMount");
    expect(typeof mod.default).toBe("function");
    const el = mod.default({ userId: "me", videoId: "v1", watchMs: 6000 } as any);
    // React element for null is literally null
    expect(el).toBe(null);
  });

  it("returns an element when vibeTagsLiteEnabled() is true", async () => {
    vi.resetModules();

    vi.doMock("../../lib/flags/vibeTags", () => ({
      vibeTagsLiteEnabled: () => true,
    }));

    const mod = await import("../../components/vibe/VibeTrayMount");
    const el = mod.default({ userId: "me", videoId: "v1", watchMs: 6000 } as any);
    expect(el).toBeTruthy();
  });
});
