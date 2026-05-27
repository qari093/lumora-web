import { describe, expect, it } from "vitest";
import {
  addRuntimeCache,
  batchApiPayload,
  optimizeFypRenderingPipeline,
  reduceMemoryFootprint,
  validateLatencyTarget,
} from "@/src/lib/integration/performance";

describe("Pack17 Performance Optimization", () => {
  it("passes performance optimization flow", () => {
    const rendered = optimizeFypRenderingPipeline([1,2,3,4], 2);
    const memory = reduceMemoryFootprint({ activePlayers: 6 });
    const cache = addRuntimeCache("feed", rendered);
    const batches = batchApiPayload([1,2,3,4,5], 2);

    expect(rendered.items).toHaveLength(2);
    expect(rendered.virtualized).toBe(true);
    expect(memory.activePlayers).toBe(3);
    expect(memory.capped).toBe(true);
    expect(cache.cached).toBe(true);
    expect(batches).toHaveLength(3);
    expect(validateLatencyTarget({ latencyMs: 180 }).ok).toBe(true);
    expect(validateLatencyTarget({ latencyMs: 250 }).ok).toBe(false);
  });
});
