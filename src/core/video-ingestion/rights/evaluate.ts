import type { CanonicalVideoAsset } from "../runtime";
import { createProvenanceRecord, verifyProvenanceRecord } from "./provenance";
import type { RightsEvaluation, RightsPolicy } from "./types";

export function evaluateAssetRights(
  asset: CanonicalVideoAsset,
  policy: RightsPolicy,
): RightsEvaluation {
  const provenance = createProvenanceRecord(asset, policy);
  const verification = verifyProvenanceRecord(provenance);

  const issues = [...verification.issues];

  if (policy.expiresAt && Date.parse(policy.expiresAt) <= Date.now()) {
    issues.push("policy_expired");
  }

  const allowedSurfaces: RightsEvaluation["allowedSurfaces"] = [];

  if (policy.allowFyp) allowedSurfaces.push("fyp");
  if (policy.allowLumaSpace) allowedSurfaces.push("lumaspace");
  if (policy.allowUniversalShare) allowedSurfaces.push("universal_share");
  if (policy.allowEmbed) allowedSurfaces.push("embed");

  let decision: RightsEvaluation["decision"] = "allow";

  if (issues.length) {
    decision = "quarantine";
  }

  if (!allowedSurfaces.length) {
    decision = "reject";
  }

  return {
    assetId: asset.id,
    providerId: asset.providerId,
    decision,
    policy,
    provenance,
    issues,
    allowedSurfaces,
  };
}
