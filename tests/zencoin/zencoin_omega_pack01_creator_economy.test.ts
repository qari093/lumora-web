import { describe, expect, it } from "vitest";
import {
  creatorEconomy,
  creatorEconomyHealthy
} from "@/core/zencoin/creator/creatorEconomy";

describe("Zencoin Ω Pack 01 — Creator Economy", () => {
  it("supports creator systems", () => {
    expect(creatorEconomy.kycEnabled).toBe(true);
    expect(creatorEconomy.stripeConnect).toBe(true);
  });

  it("supports creator protection", () => {
    expect(creatorEconomy.moderationEnabled).toBe(true);
    expect(creatorEconomy.amlHooks).toBe(true);
  });

  it("supports creator economy health", () => {
    expect(creatorEconomyHealthy()).toBe(true);
  });
});
