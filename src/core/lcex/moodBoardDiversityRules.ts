export type MoodBoardDiversityRulesInput = {
  categories: Array<"movie" | "series" | "music" | "gaming" | "cross-media">;
  entityIds: string[];
  vibeTags: string[];
};

export type MoodBoardDiversityRulesDecision = {
  diversityScore: number;
  diverse: boolean;
  reason:
    | "high_diversity"
    | "moderate_diversity"
    | "low_category_diversity"
    | "low_entity_diversity"
    | "low_vibe_diversity";
};

function uniqueCount(values: string[]): number {
  return new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)).size;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveMoodBoardDiversity(
  input: MoodBoardDiversityRulesInput
): MoodBoardDiversityRulesDecision {
  const categoryCount = uniqueCount(input.categories);
  const entityCount = uniqueCount(input.entityIds);
  const vibeCount = uniqueCount(input.vibeTags);

  const diversityScore = clampScore(
    categoryCount * 20 +
      Math.min(entityCount, 8) * 6 +
      Math.min(vibeCount, 10) * 4
  );

  if (categoryCount <= 1) {
    return {
      diversityScore,
      diverse: false,
      reason: "low_category_diversity",
    };
  }

  if (entityCount <= 2) {
    return {
      diversityScore,
      diverse: false,
      reason: "low_entity_diversity",
    };
  }

  if (vibeCount <= 2) {
    return {
      diversityScore,
      diverse: false,
      reason: "low_vibe_diversity",
    };
  }

  if (diversityScore >= 80) {
    return {
      diversityScore,
      diverse: true,
      reason: "high_diversity",
    };
  }

  return {
    diversityScore,
    diverse: diversityScore >= 60,
    reason: "moderate_diversity",
  };
}

export function hasDiverseMoodBoard(
  input: MoodBoardDiversityRulesInput
): boolean {
  return resolveMoodBoardDiversity(input).diverse;
}
