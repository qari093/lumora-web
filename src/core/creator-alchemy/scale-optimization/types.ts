export interface ScaleOptimizationInput {
  batchLoad: number;
  replayEventsPerMinute: number;
  creatorSnapshotCount: number;
  constellationClusterLoad: number;
  cacheHitRatio: number;
  queueDepth: number;
  runtimeCostPressure: number;
}

export interface ScaleOptimizationDecision {
  batchMode: "normal" | "deferred" | "throttled";
  replayAggregationMode: "live" | "batched";
  cacheMode: "normal" | "aggressive";
  shouldFailover: boolean;
  costSafe: boolean;
  reasons: string[];
}
