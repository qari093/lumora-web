export type MoodBoardLayoutMode =
  | "grid"
  | "mosaic"
  | "spotlight"
  | "timeline";

export type MoodBoardLayoutRulesInput = {
  cardCount: number;
  dominantVibe?: string | null;
  freshnessScore: number;
  diversityScore: number;
};

export type MoodBoardLayoutRulesDecision = {
  layout: MoodBoardLayoutMode;
  columns: 1 | 2 | 3 | 4;
  reason:
    | "single_spotlight"
    | "small_grid"
    | "high_diversity_mosaic"
    | "freshness_timeline"
    | "default_grid";
};

export function resolveMoodBoardLayout(
  input: MoodBoardLayoutRulesInput
): MoodBoardLayoutRulesDecision {
  const cardCount = Math.max(0, Math.round(input.cardCount));

  if (cardCount <= 1) {
    return {
      layout: "spotlight",
      columns: 1,
      reason: "single_spotlight",
    };
  }

  if (cardCount <= 4) {
    return {
      layout: "grid",
      columns: 2,
      reason: "small_grid",
    };
  }

  if (input.diversityScore >= 75) {
    return {
      layout: "mosaic",
      columns: 3,
      reason: "high_diversity_mosaic",
    };
  }

  if (input.freshnessScore >= 80) {
    return {
      layout: "timeline",
      columns: 1,
      reason: "freshness_timeline",
    };
  }

  return {
    layout: "grid",
    columns: cardCount >= 10 ? 4 : 3,
    reason: "default_grid",
  };
}

export function prefersMosaicMoodBoardLayout(
  input: MoodBoardLayoutRulesInput
): boolean {
  return resolveMoodBoardLayout(input).layout === "mosaic";
}
