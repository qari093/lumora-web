import { FYP_PERFORMANCE_BUDGETS } from "./performanceBudgets";

export interface FypPreloadPlan {
  nextItems: number;
  secondsPerItem: number;
  fullVideoPreload: boolean;
}

export function buildFypPreloadPlan(): FypPreloadPlan {
  return {
    nextItems: FYP_PERFORMANCE_BUDGETS.maxPreloadItems,
    secondsPerItem: FYP_PERFORMANCE_BUDGETS.preloadSeconds,
    fullVideoPreload: false
  };
}
