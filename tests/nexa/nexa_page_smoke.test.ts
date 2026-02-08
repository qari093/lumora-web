import { describe, expect, it } from "vitest";

describe("NEXA page smoke", () => {
  it("imports app/nexa/page without throwing", async () => {
    const mod = await import("../../app/nexa/page");
    expect(mod).toBeTruthy();
    expect(typeof mod.default).toBe("function");
  });
});
