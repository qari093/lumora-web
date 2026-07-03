export type ChaosScenario =
  | "queue_delay"
  | "webhook_duplicate"
  | "offline_client"
  | "portal_adapter_failure"
  | "external_bridge_timeout"
  | "sync_conflict";

export function createChaosScenarioPlan(scenarios: ChaosScenario[]) {
  return scenarios.map((scenario, index) => ({
    id: `chaos_${scenario}_${index}`,
    scenario,
    expectedRecovery: "retry_or_rollback",
    maxRecoveryMs: 3000,
  }));
}

export function evaluateChaosRecovery(results: { scenario: ChaosScenario; recovered: boolean; recoveryMs: number }[]) {
  const recovered = results.filter((result) => result.recovered && result.recoveryMs <= 3000).length;
  return Number((recovered / Math.max(1, results.length)).toFixed(4));
}
