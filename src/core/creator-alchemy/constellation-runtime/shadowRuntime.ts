export interface ShadowRuntimeDecision {
  allowed: boolean;
  reason: string;
}

export function decideShadowRuntime(input: {
  creatorEligible: boolean;
  safetyPassed: boolean;
  creatorOptedIn: boolean;
}): ShadowRuntimeDecision {
  if (!input.creatorOptedIn) return { allowed: false, reason: "creator_not_opted_in" };
  if (!input.creatorEligible) return { allowed: false, reason: "creator_not_eligible" };
  if (!input.safetyPassed) return { allowed: false, reason: "safety_not_passed" };
  return { allowed: true, reason: "shadow_allowed" };
}
