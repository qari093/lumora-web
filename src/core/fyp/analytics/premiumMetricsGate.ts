import { FYP_PREMIUM_METRICS_BUDGET } from "./premiumMetricsBudget";
import type {
  FypPremiumMetricsResult,
  FypPremiumSessionMetrics
} from "./premiumMetricsTypes";

export function evaluatePremiumFeelMetrics(
  metrics: FypPremiumSessionMetrics
): FypPremiumMetricsResult {
  const failures: string[] = [];

  if (
    metrics.timeToFirstInteractionMs >
    FYP_PREMIUM_METRICS_BUDGET.timeToFirstInteractionMs
  ) {
    failures.push("time_to_first_interaction_too_slow");
  }

  if (
    metrics.accidentalSwipeBackRate >
    FYP_PREMIUM_METRICS_BUDGET.accidentalSwipeBackRateMax
  ) {
    failures.push("accidental_swipe_rate_too_high");
  }

  if (
    metrics.curiosityRingCompletionRate <
    FYP_PREMIUM_METRICS_BUDGET.curiosityRingCompletionRateMin
  ) {
    failures.push("curiosity_completion_too_low");
  }

  if (
    metrics.shareToLumaSpaceRate <
    FYP_PREMIUM_METRICS_BUDGET.shareToLumaSpaceRateMin
  ) {
    failures.push("lumaspace_share_rate_too_low");
  }

  if (
    metrics.highQualitySurveyAgreeRate <
    FYP_PREMIUM_METRICS_BUDGET.highQualitySurveyAgreeRateMin
  ) {
    failures.push("quality_survey_too_low");
  }

  return {
    ok: failures.length === 0,
    failures
  };
}
