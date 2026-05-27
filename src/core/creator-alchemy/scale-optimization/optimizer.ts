import type { ScaleOptimizationDecision, ScaleOptimizationInput } from "./types";

export function optimizeCreatorAlchemyScale(input: ScaleOptimizationInput): ScaleOptimizationDecision {
  const reasons: string[] = [];

  const batchMode =
    input.batchLoad > 0.9 ? "throttled" :
    input.batchLoad > 0.75 ? "deferred" :
    "normal";

  const replayAggregationMode = input.replayEventsPerMinute > 5000 ? "batched" : "live";
  const cacheMode = input.cacheHitRatio < 0.6 ? "aggressive" : "normal";
  const shouldFailover = input.queueDepth > 500 || input.runtimeCostPressure > 0.92;
  const costSafe = input.runtimeCostPressure <= 0.8;

  if (batchMode !== "normal") reasons.push("batch_load_high");
  if (replayAggregationMode === "batched") reasons.push("replay_volume_high");
  if (cacheMode === "aggressive") reasons.push("cache_hit_ratio_low");
  if (shouldFailover) reasons.push("failover_required");
  if (!costSafe) reasons.push("runtime_cost_pressure_high");

  return {
    batchMode,
    replayAggregationMode,
    cacheMode,
    shouldFailover,
    costSafe,
    reasons
  };
}
