import type { FeedItem } from "../core/types";
import type {
  DiscoveryEdgeRequest,
  DiscoveryEdgeResult
} from "./types";

import { calculateChaosBudget } from "../chaos/chaosBudget";
import { getSoftDissonanceModes } from "../chaos/softDissonance";

export function createDiscoveryEdgeResult(input: {
  request: DiscoveryEdgeRequest;
  candidates: FeedItem[];
  now?: number;
}): DiscoveryEdgeResult {
  if (!input.request.userId.trim()) {
    throw new Error("Discovery Edge requires userId.");
  }

  const budget = calculateChaosBudget({
    currentIntensity: input.request.currentIntensity,
    noveltyTolerance: input.request.noveltyTolerance,
    intent: input.request.intent
  });

  const allowedModes = [
    input.request.currentMode,
    ...getSoftDissonanceModes(input.request.currentMode)
  ];

  const items = input.candidates
    .filter(item => allowedModes.includes(item.mode))
    .filter(item => item.intensity <= budget.maxIntensity)
    .filter(item => item.novelty <= budget.noveltyBudget)
    .sort((a, b) => b.novelty - a.novelty)
    .slice(0, 12);

  return {
    requestId: `edge_${input.request.userId}_${input.now ?? Date.now()}`,
    userId: input.request.userId,
    targetMode: items[0]?.mode ?? input.request.currentMode,
    chaosAllowed: budget.chaosAllowed,
    maxIntensity: budget.maxIntensity,
    noveltyBudget: budget.noveltyBudget,
    items
  };
}
