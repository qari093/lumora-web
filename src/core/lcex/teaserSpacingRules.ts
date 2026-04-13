export type TeaserSpacingInput = {
  recentCategoryHistory: string[];
  recentFranchiseHistory: string[];
  candidateCategory: string;
  candidateFranchise?: string;
};

export type TeaserSpacingDecision = {
  allowed: boolean;
  reason: "ok" | "category_too_dense" | "franchise_too_dense";
  minDistanceSatisfied: boolean;
};

const MIN_CATEGORY_DISTANCE = 2;
const MIN_FRANCHISE_DISTANCE = 4;

export function resolveTeaserSpacing(
  input: TeaserSpacingInput
): TeaserSpacingDecision {
  const recentCategoryIndex = input.recentCategoryHistory.findIndex(
    (value) => value === input.candidateCategory
  );

  if (recentCategoryIndex !== -1 && recentCategoryIndex < MIN_CATEGORY_DISTANCE) {
    return {
      allowed: false,
      reason: "category_too_dense",
      minDistanceSatisfied: false,
    };
  }

  if (input.candidateFranchise) {
    const recentFranchiseIndex = input.recentFranchiseHistory.findIndex(
      (value) => value === input.candidateFranchise
    );

    if (recentFranchiseIndex !== -1 && recentFranchiseIndex < MIN_FRANCHISE_DISTANCE) {
      return {
        allowed: false,
        reason: "franchise_too_dense",
        minDistanceSatisfied: false,
      };
    }
  }

  return {
    allowed: true,
    reason: "ok",
    minDistanceSatisfied: true,
  };
}

export function canInsertTeaserWithSpacing(
  input: TeaserSpacingInput
): boolean {
  return resolveTeaserSpacing(input).allowed;
}
