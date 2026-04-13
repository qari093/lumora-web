export type MoodBoardGenerationRulesInput = {
  sourceCount: number;
  vibeTagCount: number;
  entityCount: number;
  culturalScore: number;
  rightsScore: number;
  safetyBlocked: boolean;
};

export type MoodBoardGenerationRulesDecision = {
  generatable: boolean;
  reason:
    | "ok"
    | "insufficient_sources"
    | "insufficient_vibes"
    | "low_cultural_confidence"
    | "low_rights"
    | "safety_blocked";
};

export function resolveMoodBoardGenerationRules(
  input: MoodBoardGenerationRulesInput
): MoodBoardGenerationRulesDecision {
  if (input.safetyBlocked) {
    return { generatable: false, reason: "safety_blocked" };
  }

  if (input.rightsScore < 55) {
    return { generatable: false, reason: "low_rights" };
  }

  if (input.culturalScore < 55) {
    return { generatable: false, reason: "low_cultural_confidence" };
  }

  if (input.sourceCount < 3) {
    return { generatable: false, reason: "insufficient_sources" };
  }

  if (input.vibeTagCount < 2 && input.entityCount < 2) {
    return { generatable: false, reason: "insufficient_vibes" };
  }

  return { generatable: true, reason: "ok" };
}

export function canGenerateMoodBoard(
  input: MoodBoardGenerationRulesInput
): boolean {
  return resolveMoodBoardGenerationRules(input).generatable;
}
