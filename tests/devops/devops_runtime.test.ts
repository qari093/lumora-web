import { describe, expect, it } from "vitest";

describe("devops runtime", () => {
  it("enables deployment runtime", async () => {
    const mod = await import("@/infra/runtime");
    expect(mod.deploymentRuntimeEnabled).toBe(true);
  });
});
