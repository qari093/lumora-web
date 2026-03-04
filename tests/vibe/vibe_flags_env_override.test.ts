import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  delete process.env.LUMORA_VIBE_TAGS_LITE;
  delete process.env.NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE;
});

afterEach(() => {
  delete process.env.LUMORA_VIBE_TAGS_LITE;
  delete process.env.NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE;
});

describe("Vibe flags env override", () => {
  it("forces enabled when LUMORA_VIBE_TAGS_LITE=1", async () => {
    process.env.LUMORA_VIBE_TAGS_LITE = "1";
    const mod: any = await import("../../lib/flags/vibeTags");
    const fn =
      typeof mod.vibeTagsLiteEnabled === "function"
        ? mod.vibeTagsLiteEnabled
        : typeof mod.isVibeTagsLiteEnabled === "function"
          ? mod.isVibeTagsLiteEnabled
          : undefined;

    expect(typeof fn).toBe("function");
    expect(fn()).toBe(true);
  });

  it("forces disabled when LUMORA_VIBE_TAGS_LITE=0", async () => {
    process.env.LUMORA_VIBE_TAGS_LITE = "0";
    const mod: any = await import("../../lib/flags/vibeTags");
    const fn =
      typeof mod.vibeTagsLiteEnabled === "function"
        ? mod.vibeTagsLiteEnabled
        : typeof mod.isVibeTagsLiteEnabled === "function"
          ? mod.isVibeTagsLiteEnabled
          : undefined;

    expect(typeof fn).toBe("function");
    expect(fn()).toBe(false);
  });
});
