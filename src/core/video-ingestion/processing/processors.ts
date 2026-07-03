import type { CanonicalVideoAsset } from "../runtime";
import type { ProcessedVideoAsset, ProcessingPlan, ProcessingStage } from "./types";
import { markProcessingStep } from "./plan";

function outputUrl(asset: CanonicalVideoAsset, stage: ProcessingStage) {
  return `lumora://video-ingestion/${asset.providerId}/${asset.id}/${stage}`;
}

export function runProcessingStage(
  asset: CanonicalVideoAsset,
  plan: ProcessingPlan,
  stage: ProcessingStage,
): ProcessingPlan {
  const step = plan.steps.find((item) => item.stage === stage);
  if (!step) throw new Error(`processing_step_missing:${stage}`);

  const running = markProcessingStep(plan, step.id, "running");

  if (stage === "rollback") {
    return markProcessingStep(running, step.id, "skipped", {
      outputUrl: outputUrl(asset, stage),
    });
  }

  return markProcessingStep(running, step.id, "complete", {
    outputUrl: outputUrl(asset, stage),
  });
}

export function runProcessingPipeline(asset: CanonicalVideoAsset, plan: ProcessingPlan): ProcessingPlan {
  return plan.steps.reduce(
    (current, step) => runProcessingStage(asset, current, step.stage),
    plan,
  );
}

export function materializeProcessedVideoAsset(
  asset: CanonicalVideoAsset,
  plan: ProcessingPlan,
): ProcessedVideoAsset {
  const byStage = new Map(plan.steps.map((step) => [step.stage, step.outputUrl]));

  return {
    ...asset,
    lifecycle: "validated",
    updatedAt: new Date().toISOString(),
    processing: {
      planId: plan.id,
      thumbnailUrl: byStage.get("thumbnail"),
      previewUrl: byStage.get("preview"),
      normalizedUrl: byStage.get("normalize"),
      storageKey: byStage.get("storage"),
      processedAt: new Date().toISOString(),
    },
    metadata: {
      ...asset.metadata,
      processingPlanId: plan.id,
      processingComplete: true,
    },
  };
}
