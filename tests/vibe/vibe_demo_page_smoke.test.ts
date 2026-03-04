import { describe, it, expect } from "vitest";

describe("Vibe demo page smoke", () => {
  it("module loads", async () => {
    const mod = await import("../../app/(demo)/vibe-demo/page");
    expect(typeof mod.default).toBe("function");
  });
});
