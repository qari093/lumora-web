import type { CanonicalVideoAsset } from "../runtime";
import { evaluateAssetRights } from "./evaluate";
import type { RightsEvaluation, RightsPolicy } from "./types";

export type RightsAuditLog = {
  id: string;
  createdAt: string;
  evaluations: RightsEvaluation[];
  summary: {
    total: number;
    allowed: number;
    quarantined: number;
    rejected: number;
  };
};

export function createRightsAuditLog(
  assets: CanonicalVideoAsset[],
  policy: RightsPolicy,
): RightsAuditLog {
  const evaluations = assets.map((asset) => evaluateAssetRights(asset, policy));

  return {
    id: `rights_audit_${policy.id}_${Date.now()}`,
    createdAt: new Date().toISOString(),
    evaluations,
    summary: {
      total: evaluations.length,
      allowed: evaluations.filter((item) => item.decision === "allow").length,
      quarantined: evaluations.filter((item) => item.decision === "quarantine").length,
      rejected: evaluations.filter((item) => item.decision === "reject").length,
    },
  };
}

export function applyRightsDecision(asset: CanonicalVideoAsset, evaluation: RightsEvaluation): CanonicalVideoAsset {
  if (evaluation.decision === "allow") {
    return {
      ...asset,
      metadata: {
        ...asset.metadata,
        rightsDecision: "allow",
        rightsPolicyId: evaluation.policy.id,
        allowedSurfaces: evaluation.allowedSurfaces,
      },
    };
  }

  return {
    ...asset,
    lifecycle: "quarantined",
    metadata: {
      ...asset.metadata,
      rightsDecision: evaluation.decision,
      rightsPolicyId: evaluation.policy.id,
      rightsIssues: evaluation.issues,
    },
  };
}
