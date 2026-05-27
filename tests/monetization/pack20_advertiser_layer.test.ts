import { describe, expect, it } from "vitest";
import { createCampaign } from "@/src/monetization/advertiser/campaign";
import { validateTargeting } from "@/src/monetization/advertiser/targeting";
import { evaluateBudget } from "@/src/monetization/advertiser/budget";
import { calculateBid } from "@/src/monetization/advertiser/bid";
import { evaluateAdvertiser } from "@/src/monetization/advertiser/system";

describe("Pack20", () => {
  it("campaign", () => {
    expect(createCampaign({ campaignId:"1", advertiserId:"a", budgetZen:100, dailyBudgetZen:10 }).valid).toBe(true);
  });

  it("targeting", () => {
    expect(validateTargeting({ allowedStates:["green"], maxDrift:0.5 }).ok).toBe(true);
  });

  it("budget", () => {
    expect(evaluateBudget({ total:100, spent:10, daily:20, spentToday:5 }).canSpend).toBe(true);
  });

  it("bid", () => {
    expect(calculateBid({ bid:10, relevance:0.9, state:"green" })).toBe(9);
  });

  it("system", () => {
    const r = evaluateAdvertiser({
      campaign:{ campaignId:"1", advertiserId:"a", budgetZen:100, dailyBudgetZen:10 },
      targeting:{ allowedStates:["green"], maxDrift:0.5 },
      budget:{ total:100, spent:10, daily:20, spentToday:5 },
      bid:10,
      relevance:1,
      state:"green"
    });
    expect(r.ok).toBe(true);
  });
});
