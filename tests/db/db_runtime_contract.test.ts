import { describe, it, expect } from "vitest";

describe("db runtime", () => {
  it("enables contracts", async () => {
    const mod = await import("@/core/db/contracts/runtime");
    expect(mod.dbContractsRuntimeEnabled).toBe(true);
  });
});
