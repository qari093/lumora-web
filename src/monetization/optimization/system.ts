import { assignMonetizationVariant } from "./abTest";
import { getVariantTuning } from "./tuning";
import { evaluateOptimizationFeedback } from "./feedback";
import { applyOptimizationRules } from "./rules";

export function validateOptimizationLayer(input: {
  userId: string;
  retentionDelta: number;
  revenueDelta: number;
  skipRateDelta: number;
  currentAdLoad: number;
}) {
  const variant = assignMonetizationVariant({ userId: input.userId });
  const tuning = getVariantTuning(variant);
  const feedback = evaluateOptimizationFeedback(input);
  const rules = applyOptimizationRules({
    decision: feedback.decision,
    currentAdLoad: input.currentAdLoad,
  });

  return {
    ok: tuning.minVideosBetweenAds >= 1 && rules.nextAdLoad >= 0 && rules.nextAdLoad <= 1,
    variant,
    tuning,
    feedback,
    rules,
  };
}
