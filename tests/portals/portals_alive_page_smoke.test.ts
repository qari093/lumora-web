import { describe, expect, it } from "vitest";

describe("User-alive dashboard page smoke", () => {
  it("module loads", async () => {
    const mod = await import("../../app/alive/page");
    expect(mod).toBeTruthy();
    expect(typeof mod.default).toBe("function");
  });
});
