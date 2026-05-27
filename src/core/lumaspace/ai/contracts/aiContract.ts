import type {
  HeroFrame,
  AuraPipeline,
  AiRuntime
} from "../types";

export function validateHeroFrame(
  frame: HeroFrame
): boolean {
  return Boolean(
    frame.id &&
    frame.emotion
  );
}

export function validateAuraPipeline(
  pipeline: AuraPipeline
): boolean {
  return Boolean(
    pipeline.id &&
    typeof pipeline.optimized === "boolean"
  );
}

export function validateAiRuntime(
  runtime: AiRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.pipelineId
  );
}
