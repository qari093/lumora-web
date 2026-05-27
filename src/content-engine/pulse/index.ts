export type ContentPulseMetrics = {
  ingestionQueueDepth: number;
  processingLatencyP95Ms: number;
  safetyPassRate: number;
  feedPoolSize: number;
  freshPoolSize: number;
  globalSkipRate: number;
  cdnCacheHitRatio: number;
  estimatedCostPer1000Displays: number;
};

export type SelfHealingAction = {
  action: "none" | "throttle_uploads" | "increase_exploration" | "demote_content" | "cold_storage_sweep";
  reason: string;
  severity: "low" | "medium" | "high";
};

export function buildContentPulseSnapshot(metrics: ContentPulseMetrics) {
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    metrics,
    health: calculatePulseHealth(metrics),
    actions: recommendSelfHealingActions(metrics),
  };
}

export function calculatePulseHealth(metrics: ContentPulseMetrics) {
  if (
    metrics.processingLatencyP95Ms > 60000 ||
    metrics.feedPoolSize < 10 ||
    metrics.globalSkipRate > 0.6 ||
    metrics.estimatedCostPer1000Displays > 0.5
  ) {
    return "critical" as const;
  }

  if (
    metrics.processingLatencyP95Ms > 30000 ||
    metrics.feedPoolSize < 30 ||
    metrics.globalSkipRate > 0.4
  ) {
    return "watch" as const;
  }

  return "healthy" as const;
}

export function recommendSelfHealingActions(metrics: ContentPulseMetrics): SelfHealingAction[] {
  const actions: SelfHealingAction[] = [];

  if (metrics.processingLatencyP95Ms > 60000) {
    actions.push({
      action: "throttle_uploads",
      reason: "processing_latency_high",
      severity: "high",
    });
  }

  if (metrics.globalSkipRate > 0.6) {
    actions.push({
      action: "increase_exploration",
      reason: "skip_rate_spike",
      severity: "medium",
    });
  }

  if (metrics.feedPoolSize < 10) {
    actions.push({
      action: "increase_exploration",
      reason: "feed_pool_low",
      severity: "high",
    });
  }

  if (metrics.estimatedCostPer1000Displays > 0.5) {
    actions.push({
      action: "cold_storage_sweep",
      reason: "cost_threshold_exceeded",
      severity: "medium",
    });
  }

  return actions.length ? actions : [{ action: "none", reason: "system_stable", severity: "low" }];
}

export function shouldDemoteContent(input: {
  rollingSkipRate: number;
  reportCount: number;
}) {
  return {
    demote: input.rollingSkipRate > 0.6 || input.reportCount >= 3,
    reason:
      input.reportCount >= 3
        ? "multi_user_reports"
        : input.rollingSkipRate > 0.6
          ? "rolling_skip_spike"
          : "content_stable",
  };
}

export function shouldThrottleUploads(input: {
  processingLatencyP95Ms: number;
  queueDepth: number;
}) {
  return {
    throttle: input.processingLatencyP95Ms > 60000 || input.queueDepth > 100,
    retryAfterSec: input.processingLatencyP95Ms > 60000 || input.queueDepth > 100 ? 120 : 0,
  };
}

export function validateContentPulseSnapshot(snapshot: ReturnType<typeof buildContentPulseSnapshot>) {
  return {
    ok:
      snapshot.ok === true &&
      snapshot.generatedAt &&
      snapshot.metrics &&
      ["healthy", "watch", "critical"].includes(snapshot.health) &&
      Array.isArray(snapshot.actions),
  };
}
