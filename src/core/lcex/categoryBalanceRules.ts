export type BalanceCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type CategoryBalanceInput = {
  recentCategories: BalanceCategory[];
  candidateCategory: BalanceCategory;
  maxDominanceRatio?: number;
};

export type CategoryBalanceDecision = {
  allowed: boolean;
  ratio: number;
  reason: "ok" | "category_overrepresented";
};

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function resolveCategoryBalance(
  input: CategoryBalanceInput
): CategoryBalanceDecision {
  const maxDominanceRatio = input.maxDominanceRatio ?? 0.5;
  const total = input.recentCategories.length;

  if (total === 0) {
    return {
      allowed: true,
      ratio: 0,
      reason: "ok",
    };
  }

  const count = input.recentCategories.filter(
    (category) => category === input.candidateCategory
  ).length;

  const ratio = round((count + 1) / (total + 1));

  if (ratio > maxDominanceRatio) {
    return {
      allowed: false,
      ratio,
      reason: "category_overrepresented",
    };
  }

  return {
    allowed: true,
    ratio,
    reason: "ok",
  };
}

export function canInsertCategoryWithBalance(
  input: CategoryBalanceInput
): boolean {
  return resolveCategoryBalance(input).allowed;
}
