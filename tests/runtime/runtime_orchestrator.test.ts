import { describe, expect, it } from "vitest";
import { runtimeOrchestrator } from "@/src/core/runtime/orchestrator/runtimeOrchestrator";

describe("runtime orchestrator", () => {
  it("orchestrates correctly", () => {
    expect(runtimeOrchestrator().synchronized).toBe(true);
  });
});
