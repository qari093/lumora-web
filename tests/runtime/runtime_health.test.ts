import { describe, expect, it } from "vitest";
import { runtimeHealth } from "@/src/core/runtime/health/runtimeHealth";

describe("runtime health", () => {
  it("runtime healthy", () => {
    expect(runtimeHealth.healthy).toBe(true);
  });
});
