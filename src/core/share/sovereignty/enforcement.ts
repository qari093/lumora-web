import type { CreatorRightsPolicy, SovereigntyDecision } from "./types";

export function evaluateCreatorRights(
  policy: CreatorRightsPolicy,
  action: "view" | "share" | "remix" | "download" | "commercial_use",
): SovereigntyDecision {
  const requiredActions: string[] = [];

  if (policy.attributionRequired) requiredActions.push("preserve_attribution");
  if (policy.watermarkRequired) requiredActions.push("apply_watermark");

  if (action === "remix" && !policy.remixAllowed) {
    return { allowed: false, reason: "remix_not_allowed", requiredActions };
  }

  if (action === "download" && !policy.downloadAllowed) {
    return { allowed: false, reason: "download_not_allowed", requiredActions };
  }

  if (action === "commercial_use" && !policy.commercialUseAllowed) {
    return { allowed: false, reason: "commercial_use_not_allowed", requiredActions };
  }

  return { allowed: true, reason: "creator_rights_satisfied", requiredActions };
}

export function assertCreatorRights(policy: CreatorRightsPolicy, action: Parameters<typeof evaluateCreatorRights>[1]) {
  const decision = evaluateCreatorRights(policy, action);
  if (!decision.allowed) throw new Error(`creator_rights_denied:${decision.reason}`);
  return decision;
}
