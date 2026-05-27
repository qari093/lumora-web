import type {
  SafetyDecision,
  SafetyInput
} from "../types";

import { validateSafetyInput } from "../contracts/safetyPolicyContract";

const BLOCKED_TAGS = new Set([
  "pirated",
  "stolen",
  "adult",
  "violence_extreme"
]);

const REVIEW_TAGS = new Set([
  "news",
  "politics",
  "medical",
  "financial"
]);

export function evaluateSafetyPolicy(
  input: SafetyInput
): SafetyDecision {
  if (!validateSafetyInput(input)) {
    throw new Error("invalid_safety_input");
  }

  const reasons: string[] = [];

  for (const tag of input.tags) {
    if (BLOCKED_TAGS.has(tag)) {
      reasons.push(`blocked_tag:${tag}`);
    }
  }

  if (!input.hasLicenseProof) {
    reasons.push("missing_license_proof");
  }

  if (reasons.length > 0) {
    return {
      itemId: input.itemId,
      level: "block",
      reasons,
      allowed: false
    };
  }

  for (const tag of input.tags) {
    if (REVIEW_TAGS.has(tag)) {
      reasons.push(`review_tag:${tag}`);
    }
  }

  if (reasons.length > 0) {
    return {
      itemId: input.itemId,
      level: "review",
      reasons,
      allowed: true
    };
  }

  return {
    itemId: input.itemId,
    level: "allow",
    reasons: [],
    allowed: true
  };
}
