import type { ProcessedVideoAsset, ProcessingPlan } from "./types";

export type RollbackResult = {
  ok: boolean;
  assetId: string;
  restoredLifecycle: string;
  restoredPlanId: string;
  timestamp: string;
};

export function rollbackProcessedAsset(
  asset: ProcessedVideoAsset,
  plan: ProcessingPlan,
): RollbackResult {
  return {
    ok: true,
    assetId: asset.id,
    restoredLifecycle: "validated",
    restoredPlanId: plan.id,
    timestamp: new Date().toISOString(),
  };
}
