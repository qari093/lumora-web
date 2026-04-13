export type VersusCardDiversityInput = {
  recentCategories: Array<"movie" | "series" | "music" | "gaming" | "cross-media">;
  recentEntityIds: string[];
  candidateCategory: "movie" | "series" | "music" | "gaming" | "cross-media";
  leftEntityId: string;
  rightEntityId: string;
};

export type VersusCardDiversityDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "category_repetition"
    | "entity_repetition";
};

export function resolveVersusCardDiversity(
  input: VersusCardDiversityInput
): VersusCardDiversityDecision {
  const recentCategoryCount = input.recentCategories.filter(
    (c) => c === input.candidateCategory
  ).length;

  if (recentCategoryCount >= 3) {
    return {
      allowed: false,
      reason: "category_repetition",
    };
  }

  const entityConflict =
    input.recentEntityIds.includes(input.leftEntityId.trim()) ||
    input.recentEntityIds.includes(input.rightEntityId.trim());

  if (entityConflict) {
    return {
      allowed: false,
      reason: "entity_repetition",
    };
  }

  return {
    allowed: true,
    reason: "ok",
  };
}

export function canInsertVersusCardWithDiversity(
  input: VersusCardDiversityInput
): boolean {
  return resolveVersusCardDiversity(input).allowed;
}
