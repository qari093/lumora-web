import { describe, expect, it } from "vitest";
import {
  creativeGrowthFund,
  userPreferenceIsBinding,
  fundExplanation,
  creativeGrowthFundHealthy
} from "@/core/zencoin/growth-fund/creativeGrowthFund";

describe("Zencoin Pack 17 — Creative Growth Fund", () => {
  it("supports transparent fund systems", () => {
    expect(creativeGrowthFund.publicSummary).toBe(true);
    expect(creativeGrowthFund.allocationTracking).toBe(true);
  });

  it("keeps preferences non binding", () => {
    expect(userPreferenceIsBinding()).toBe(false);
    expect(fundExplanation()).toContain("without granting governance");
  });

  it("supports fund health", () => {
    expect(creativeGrowthFundHealthy()).toBe(true);
  });
});
