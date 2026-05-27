import { buildCreatorInsight } from "./insights";
import { buildGrowthSuggestion } from "./suggestions";
import { calculateCreatorGrowthBoost } from "./rewardBoost";
import { getCreatorEngagementTools } from "./tools";

export function validateCreatorGrowthLayer(input: {
  creatorId: string;
  presenceDepth: number;
  resonance: number;
  drift: number;
  zenScore: number;
  chaosEligible: boolean;
  recentImprovement: number;
  eligible: boolean;
}) {
  const insight = buildCreatorInsight(input);
  const suggestion = buildGrowthSuggestion(input);
  const boost = calculateCreatorGrowthBoost(input);
  const tools = getCreatorEngagementTools(input);

  return {
    ok: Boolean(insight.creatorId && suggestion && boost >= 1),
    insight,
    suggestion,
    boost,
    tools,
  };
}
