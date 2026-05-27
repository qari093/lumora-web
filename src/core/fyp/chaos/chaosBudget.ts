export type ChaosBudget = {
  maxIntensity: number;
  noveltyBudget: number;
  chaosAllowed: boolean;
  reason: string;
};

export function calculateChaosBudget(input: {
  currentIntensity: number;
  noveltyTolerance: number;
  intent: "expand" | "unexpected" | "edge_mode" | "push_atmosphere";
}): ChaosBudget {
  const baseNovelty = Math.max(0, Math.min(100, input.noveltyTolerance));
  const currentIntensity = Math.max(0, Math.min(10, input.currentIntensity));

  if (input.intent === "edge_mode") {
    return {
      maxIntensity: Math.min(10, currentIntensity + 3),
      noveltyBudget: Math.min(100, baseNovelty + 30),
      chaosAllowed: true,
      reason: "edge_mode_opt_in"
    };
  }

  if (input.intent === "unexpected") {
    return {
      maxIntensity: Math.min(10, currentIntensity + 2),
      noveltyBudget: Math.min(100, baseNovelty + 20),
      chaosAllowed: true,
      reason: "controlled_unexpected"
    };
  }

  return {
    maxIntensity: Math.min(10, currentIntensity + 1),
    noveltyBudget: Math.min(100, baseNovelty + 10),
    chaosAllowed: false,
    reason: "safe_expansion"
  };
}
