import { createCampaign } from "./campaign";
import { validateTargeting } from "./targeting";
import { evaluateBudget } from "./budget";
import { calculateBid } from "./bid";

export function evaluateAdvertiser(input: {
  campaign: any;
  targeting: any;
  budget: any;
  bid: number;
  relevance: number;
  state: "green" | "yellow" | "red";
}) {
  const c = createCampaign(input.campaign);
  const t = validateTargeting(input.targeting);
  const b = evaluateBudget(input.budget);
  const score = calculateBid({
    bid: input.bid,
    relevance: input.relevance,
    state: input.state,
  });

  return {
    ok: c.valid && t.ok && b.canSpend && score > 0,
    score,
  };
}
