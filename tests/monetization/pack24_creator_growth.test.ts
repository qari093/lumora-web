import { describe, expect, it } from "vitest";
import { buildCreatorInsight } from "@/src/monetization/creator-growth/insights";
import { buildGrowthSuggestion } from "@/src/monetization/creator-growth/suggestions";
import { calculateCreatorGrowthBoost } from "@/src/monetization/creator-growth/rewardBoost";
import { getCreatorEngagementTools } from "@/src/monetization/creator-growth/tools";
import { validateCreatorGrowthLayer } from "@/src/monetization/creator-growth/system";

describe("Monetization Pack24 — Creator Growth Layer", () => {
  it("builds creator insight", () => {
    const insight = buildCreatorInsight({
      creatorId: "c1",
      presenceDepth: 0.7,
      resonance: 0.3,
      drift: 0.1,
    });

    expect(insight.strongest).toBe("presence_depth");
    expect(insight.health).toBe("healthy");
  });

  it("builds growth suggestions", () => {
    expect(buildGrowthSuggestion({
      drift: 0.6,
      presenceDepth: 0.8,
      resonance: 0.4,
    })).toContain("Shorten opening");
  });

  it("calculates creator growth boost", () => {
    const boost = calculateCreatorGrowthBoost({
      zenScore: 0.8,
      chaosEligible: true,
      recentImprovement: 0.1,
    });

    expect(boost).toBeGreaterThan(1.2);
  });

  it("returns eligible creator tools", () => {
    const tools = getCreatorEngagementTools({
      eligible: true,
      zenScore: 0.85,
    });

    expect(tools).toContain("insight_panel");
    expect(tools).toContain("priority_growth_hint");
  });

  it("validates full creator growth layer", () => {
    const result = validateCreatorGrowthLayer({
      creatorId: "c1",
      presenceDepth: 0.7,
      resonance: 0.4,
      drift: 0.1,
      zenScore: 0.8,
      chaosEligible: true,
      recentImprovement: 0.1,
      eligible: true,
    });

    expect(result.ok).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);
  });
});
