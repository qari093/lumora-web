import {
  canServeFypSourceDirectly,
  getFypSourceGovernance,
  requiresFypAttribution
} from "./sourceGovernance";

export type FypLicenseGateInput = {
  sourceId: string;
  videoId: string;
  shareTarget?: "fyp" | "lumaspace" | "external";
};

export type FypLicenseGateResult = {
  allowed: boolean;
  sourceId: string;
  videoId: string;
  reason: string;
  attributionRequired: boolean;
  humanReviewRequired: boolean;
};

export function evaluateFypLicenseGate(input: FypLicenseGateInput): FypLicenseGateResult {
  const source = getFypSourceGovernance(input.sourceId);

  if (!source) {
    return {
      allowed: false,
      sourceId: input.sourceId,
      videoId: input.videoId,
      reason: "unknown_source_blocked",
      attributionRequired: false,
      humanReviewRequired: true
    };
  }

  if (input.shareTarget === "lumaspace" && !source.commercialUseAllowed) {
    return {
      allowed: false,
      sourceId: source.sourceId,
      videoId: input.videoId,
      reason: "non_commercial_source_blocked_for_lumaspace",
      attributionRequired: source.attributionRequired,
      humanReviewRequired: source.requiresHumanReview
    };
  }

  if (!canServeFypSourceDirectly(source.sourceId)) {
    return {
      allowed: false,
      sourceId: source.sourceId,
      videoId: input.videoId,
      reason: source.embedOnly ? "embed_only_source_not_direct_playable" : "source_not_direct_serving_safe",
      attributionRequired: source.attributionRequired,
      humanReviewRequired: source.requiresHumanReview
    };
  }

  return {
    allowed: true,
    sourceId: source.sourceId,
    videoId: input.videoId,
    reason: "source_license_allowed",
    attributionRequired: requiresFypAttribution(source.sourceId),
    humanReviewRequired: source.requiresHumanReview
  };
}
