import { describe, expect, it } from "vitest";
import { lowPowerMode } from "@/src/core/performance-optimization/memory/lowPowerMode";
import { leakGuard } from "@/src/core/performance-optimization/memory/leakGuard";
import { memoryValidator } from "@/src/core/performance-optimization/memory/memoryValidator";

describe("memory optimization", () => {
  it("supports low power mode", () => {
    expect(lowPowerMode.reducesParticles).toBe(true);
  });

  it("guards leaks", () => {
    expect(leakGuard(10).safe).toBe(true);
  });

  it("validates memory budget", () => {
    expect(memoryValidator(320).valid).toBe(true);
  });
});
