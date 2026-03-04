import { describe, it, expect } from "vitest";

describe("VibeStatusBadge smoke", () => {
  it("module loads", async () => {
    const mod = await import("../../components/vibe/VibeStatusBadge");
    expect(mod).toBeTruthy();
    expect(typeof (mod as any).default).toBe("function");
  });
});
