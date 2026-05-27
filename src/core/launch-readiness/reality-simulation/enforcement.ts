import type { RealityEnforcementDecision, SimulationRiskFinding } from "./types";

const CRITICAL_RUNTIME_HINTS = [
  "wallet",
  "payment",
  "checkout",
  "order",
  "ledger",
  "media",
  "upload",
  "stream",
  "gmar",
  "fyp",
  "live",
  "creator"
];

export function buildRealityEnforcementDecisions(findings: SimulationRiskFinding[]): RealityEnforcementDecision[] {
  const grouped = new Map<string, SimulationRiskFinding[]>();

  for (const finding of findings) {
    const runtime =
      CRITICAL_RUNTIME_HINTS.find((hint) => finding.file.toLowerCase().includes(hint)) ?? "general";

    grouped.set(runtime, [...(grouped.get(runtime) ?? []), finding]);
  }

  return [...grouped.entries()].map(([runtime, runtimeFindings]) => {
    const critical = runtimeFindings.some((finding) => finding.severity === "critical");
    const high = runtimeFindings.some((finding) => finding.severity === "high");

    return {
      runtime,
      allowed: !critical,
      reason: critical
        ? "critical_simulation_risk_blocks_launch"
        : high
          ? "high_simulation_risk_requires_review"
          : "runtime_allowed_with_monitoring",
      ...(critical || high
        ? { requiredFix: "Replace simulated path with real persistence/runtime adapter or mark feature inactive." }
        : {})
    };
  });
}
