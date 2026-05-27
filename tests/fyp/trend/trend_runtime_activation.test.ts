import { describe, expect, it } from "vitest";

import { validateTrendSignal } from "@/src/core/fyp/trend/contracts/trendContract";
import { calculateTrend } from "@/src/core/fyp/trend/runtime/trendVelocity";
import { runTrendRuntime } from "@/src/core/fyp/trend/runtime/trendRuntime";

describe(
  "Lumora FYP Trend Runtime Activation",
  () => {
    const signal = {
      id: "trend-1",
      velocity: 95,
      engagement: 90
    };

    it("validates trend signal", () => {
      expect(
        validateTrendSignal(signal)
      ).toBe(true);
    });

    it("calculates trend score", () => {
      const result =
        calculateTrend(signal);

      expect(result.score).toBeGreaterThan(80);
    });

    it("detects upward trend", () => {
      const result =
        calculateTrend(signal);

      expect(result.direction).toBe("up");
    });

    it("supports downward trend", () => {
      const result = calculateTrend({
        id: "trend-2",
        velocity: 10,
        engagement: 20
      });

      expect(result.direction).toBe("down");
    });

    it("runs trend runtime", () => {
      const runtime =
        runTrendRuntime([signal]);

      expect(runtime.active).toBe(true);
      expect(runtime.trends).toHaveLength(1);
    });
  }
);
