export function createShareMonitoringSignals() {
  return [
    "usl.share.created.count",
    "usl.share.delivered.count",
    "usl.share.failed.count",
    "usl.queue.depth",
    "usl.webhook.duplicates.count",
    "usl.external.bridge.failures.count",
    "usl.sync.conflicts.count",
    "usl.privacy.blocks.count",
  ];
}

export function createShareAlertRules() {
  return [
    { id: "usl_high_failure_rate", metric: "usl.share.failed.count", threshold: 10, windowMinutes: 5 },
    { id: "usl_queue_depth_high", metric: "usl.queue.depth", threshold: 100, windowMinutes: 10 },
    { id: "usl_bridge_failures_high", metric: "usl.external.bridge.failures.count", threshold: 20, windowMinutes: 15 },
    { id: "usl_privacy_blocks_spike", metric: "usl.privacy.blocks.count", threshold: 25, windowMinutes: 10 },
  ];
}
