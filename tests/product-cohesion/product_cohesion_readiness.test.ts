import { describe, expect, it } from "vitest";
import { ecosystemConsumerSimulation } from "@/src/core/product-cohesion/simulation/ecosystemConsumerSimulation";
import { consumerLaunchGate } from "@/src/core/product-cohesion/readiness/consumerLaunchGate";
import { readinessScore } from "@/src/core/product-cohesion/reporting/readinessScore";

describe("product cohesion readiness", () => {
  it("passes ecosystem consumer simulation", () => {
    expect(ecosystemConsumerSimulation().pass).toBe(true);
  });

  it("opens controlled beta gate", () => {
    expect(consumerLaunchGate().controlledBetaReady).toBe(true);
  });

  it("scores readiness", () => {
    expect(readinessScore([95, 92, 98]).ready).toBe(true);
  });
});
