export type CreatorMetricKind =
  | "view"
  | "follow"
  | "like"
  | "comment"
  | "present"
  | "stillness"
  | "hold"
  | "rewatch"
  | "silent-ovation"
  | "deep-engagement"
  | "quiet-resonance";

export type MetricRuleDecision = {
  ok: boolean;
  reason: string;
};

const VANITY_METRICS = new Set<CreatorMetricKind>([
  "view",
  "follow",
  "like",
  "comment",
]);

const HUMAN_SIGNAL_METRICS = new Set<CreatorMetricKind>([
  "present",
  "stillness",
  "hold",
  "rewatch",
  "silent-ovation",
  "deep-engagement",
  "quiet-resonance",
]);

export function validateCreatorMetricForCircle(metric: CreatorMetricKind): MetricRuleDecision {
  if (VANITY_METRICS.has(metric)) {
    return {
      ok: false,
      reason: "vanity_metric_hidden_inside_creator_circles",
    };
  }

  if (HUMAN_SIGNAL_METRICS.has(metric)) {
    return {
      ok: true,
      reason: "human_signal_allowed",
    };
  }

  return {
    ok: false,
    reason: "unknown_metric",
  };
}

export function assertNoFakeMetrics(metrics: CreatorMetricKind[]): MetricRuleDecision {
  const blocked = metrics.find((metric) => !validateCreatorMetricForCircle(metric).ok);

  if (blocked) {
    return {
      ok: false,
      reason: `blocked_metric:${blocked}`,
    };
  }

  return {
    ok: true,
    reason: "all_metrics_are_human_signals",
  };
}
