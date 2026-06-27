import { FYP_PERFORMANCE_BUDGETS } from "./performanceBudgets";
import type {
  FypPerformanceResult,
  FypPerformanceSample
} from "./performanceTypes";

export function evaluateFypPerformance(
  sample: FypPerformanceSample
): FypPerformanceResult {
  const failures: string[] = [];

  const ttffLimit =
    sample.network === "3g"
      ? FYP_PERFORMANCE_BUDGETS.timeToFirstFrame3gMs
      : FYP_PERFORMANCE_BUDGETS.timeToFirstFrameWifiMs;

  if (sample.timeToFirstFrameMs > ttffLimit) {
    failures.push("ttff_budget_exceeded");
  }

  if (sample.memoryMb > FYP_PERFORMANCE_BUDGETS.playerMemoryMb) {
    failures.push("memory_budget_exceeded");
  }

  const cpuLimit = sample.background
    ? FYP_PERFORMANCE_BUDGETS.cpuBackgroundPercent
    : FYP_PERFORMANCE_BUDGETS.cpuPlaybackPercent;

  if (sample.cpuPercent > cpuLimit) {
    failures.push("cpu_budget_exceeded");
  }

  if (sample.preloadSeconds > FYP_PERFORMANCE_BUDGETS.preloadSeconds) {
    failures.push("preload_seconds_exceeded");
  }

  if (sample.preloadItems > FYP_PERFORMANCE_BUDGETS.maxPreloadItems) {
    failures.push("preload_items_exceeded");
  }

  return {
    ok: failures.length === 0,
    failures
  };
}
