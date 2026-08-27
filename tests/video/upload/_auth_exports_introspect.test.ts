import { describe, expect, it } from "vitest";

describe("auth exports introspection", () => {
  it("loads the canonical Lumora auth options deterministically", async () => {
    const mod = await import("@/src/core/auth/authOptions");
    const keys = Object.keys(mod).sort();

    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain("authOptions");
  });
});
