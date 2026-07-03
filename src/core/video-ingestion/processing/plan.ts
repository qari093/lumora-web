import type { CanonicalVideoAsset } from "../runtime";
import type { ProcessingPlan, ProcessingStage, ProcessingStep } from "./types";

function createStep(asset: CanonicalVideoAsset, stage: ProcessingStage, index: number): ProcessingStep {
  return {
    id: `process_${asset.id}_${String(index + 1).padStart(2, "0")}_${stage}`,
    stage,
    status: "pending",
    inputAssetId: asset.id,
  };
}

export function createProcessingPlan(asset: CanonicalVideoAsset): ProcessingPlan {
  const now = new Date().toISOString();
  const stages: ProcessingStage[] = [
    "download",
    "stream_probe",
    "thumbnail",
    "preview",
    "transcode",
    "normalize",
    "storage",
    "rollback",
  ];

  return {
    id: `processing_plan_${asset.id}`,
    assetId: asset.id,
    providerId: asset.providerId,
    steps: stages.map((stage, index) => createStep(asset, stage, index)),
    createdAt: now,
    updatedAt: now,
  };
}

export function markProcessingStep(
  plan: ProcessingPlan,
  stepId: string,
  status: ProcessingStep["status"],
  extra: Partial<ProcessingStep> = {},
): ProcessingPlan {
  return {
    ...plan,
    updatedAt: new Date().toISOString(),
    steps: plan.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            ...extra,
            status,
            completedAt: status === "complete" || status === "failed" || status === "skipped"
              ? new Date().toISOString()
              : step.completedAt,
            startedAt: status === "running" ? new Date().toISOString() : step.startedAt,
          }
        : step,
    ),
  };
}

export function summarizeProcessingPlan(plan: ProcessingPlan) {
  const complete = plan.steps.filter((step) => step.status === "complete" || step.status === "skipped").length;
  const failed = plan.steps.filter((step) => step.status === "failed").length;

  return {
    total: plan.steps.length,
    complete,
    failed,
    ready: failed === 0 && complete === plan.steps.length,
  };
}
