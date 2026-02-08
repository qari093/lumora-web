import { describe, expect, it } from "vitest";

describe("middleware smoke", () => {
  it("exports middleware + matcher targets /api/nexa/*", async () => {
    const mod = await import("../../middleware");
    expect(typeof mod.middleware).toBe("function");
    expect(mod.config).toBeTruthy();
    expect(Array.isArray(mod.config.matcher)).toBe(true);
    expect(mod.config.matcher.join(" ")).toContain("/api/nexa");
  });
});
