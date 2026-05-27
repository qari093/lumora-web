import { describe, expect, it } from "vitest";
import { measureLatency } from "@/core/performance/runtime";

describe("performance runtime", () => {
  it("measures latency", () => {
    expect(measureLatency(120)).toBe(true);
  });
});
