import type { GravityIntentResult } from "./types";

export type GravityFeedbackDecision = {
  hapticPreview: boolean;
  hapticConfirm: boolean;
  label: "none" | "pull_to_return" | "release_preview";
};

export function computeGravityFeedback(result: GravityIntentResult): GravityFeedbackDecision {
  if (!result.shadowOnly) {
    return { hapticPreview: false, hapticConfirm: false, label: "none" };
  }

  const hapticPreview = result.proximity >= 0.55 && result.intentScore >= 0.42;
  const hapticConfirm = result.shouldShowRing && result.confidence >= 0.78;

  return {
    hapticPreview,
    hapticConfirm,
    label: result.shouldShowRing ? "pull_to_return" : hapticPreview ? "release_preview" : "none",
  };
}
