import { describe, expect, it } from "vitest";
import { createAdImpression } from "@/src/monetization/attribution/impression";
import { scoreAdEngagement } from "@/src/monetization/attribution/engagement";
import { createAdConversion } from "@/src/monetization/attribution/conversion";
import { attributeAdValue } from "@/src/monetization/attribution/model";
import { validateAttributionAccuracy } from "@/src/monetization/attribution/validate";

describe("Monetization Pack18 — Attribution Engine", () => {
  it("tracks valid impressions", () => {
    const impression = createAdImpression({
      impressionId: "imp1",
      adId: "ad1",
      campaignId: "camp1",
      userId: "u1",
      shownAt: 1000,
      state: "green",
    });

    expect(impression.valid).toBe(true);
  });

  it("scores engagement events", () => {
    const score = scoreAdEngagement([
      { impressionId: "imp1", type: "view_2s", occurredAt: 1000 },
      { impressionId: "imp1", type: "hold", occurredAt: 2000 },
      { impressionId: "imp1", type: "click", occurredAt: 3000 },
    ]);

    expect(score).toBeGreaterThan(1);
  });

  it("tracks conversions", () => {
    const conversion = createAdConversion({
      conversionId: "conv1",
      impressionId: "imp1",
      campaignId: "camp1",
      value: 10,
      occurredAt: 5000,
    });

    expect(conversion.valid).toBe(true);
  });

  it("attributes ad value", () => {
    const impression = createAdImpression({
      impressionId: "imp1",
      adId: "ad1",
      campaignId: "camp1",
      userId: "u1",
      shownAt: 1000,
      state: "green",
    });

    const attribution = attributeAdValue({
      impression,
      engagements: [{ impressionId: "imp1", type: "reward_complete", occurredAt: 2000 }],
      conversion: {
        conversionId: "conv1",
        impressionId: "imp1",
        campaignId: "camp1",
        value: 5,
        occurredAt: 4000,
      },
    });

    expect(attribution.valid).toBe(true);
    expect(attribution.totalAttributedValue).toBe(6);
  });

  it("validates attribution accuracy", () => {
    const impression = createAdImpression({
      impressionId: "imp1",
      adId: "ad1",
      campaignId: "camp1",
      userId: "u1",
      shownAt: 1000,
      state: "yellow",
    });

    const result = validateAttributionAccuracy({
      impression,
      engagements: [{ impressionId: "imp1", type: "hold", occurredAt: 2000 }],
    });

    expect(result.ok).toBe(true);
    expect(result.attribution.campaignId).toBe("camp1");
  });
});
