import { describe, it, expect } from "vitest";

describe("NEXA ops page smoke", () => {
  it("loads module", async () => {
    const mod = await import("../../app/nexa/ops/page");
    expect(mod).toBeTruthy();
    expect(typeof mod.default).toBe("function");
  });
});
