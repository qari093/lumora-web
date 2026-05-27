import { describe, expect, it } from "vitest";
import {
  calmSpending,
  cooldownRequired,
  calmSpendingHealthy
} from "@/core/zencoin/spending/calmSpending";

describe("Zencoin Pack 10 — Calm Spending", () => {
  it("supports humane spending", () => {
    expect(calmSpending.humaneNudges).toBe(true);
  });

  it("supports cooldowns", () => {
    expect(cooldownRequired(25)).toBe(true);
    expect(cooldownRequired(5)).toBe(false);
  });

  it("supports spending health", () => {
    expect(calmSpendingHealthy()).toBe(true);
  });
});
