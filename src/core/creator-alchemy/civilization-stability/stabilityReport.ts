import type { CivilizationStabilityReport, GovernanceSignal, InfrastructureSignal } from "./types";
import { evaluateGovernanceSafety } from "./governance";
import { evaluateInfrastructureSafety } from "./infrastructure";

export function buildCivilizationStabilityReport(input: {
  governance: GovernanceSignal;
  infrastructure: InfrastructureSignal;
}): CivilizationStabilityReport {
  const governance = evaluateGovernanceSafety(input.governance);
  const infrastructure = evaluateInfrastructureSafety(input.infrastructure);
  const reasons = [...governance.reasons, ...infrastructure.reasons];

  const level =
    reasons.length === 0
      ? "stable"
      : reasons.length <= 2
        ? "watch"
        : reasons.length <= 4
          ? "degraded"
          : "blocked";

  return {
    level,
    governanceSafe: governance.ok,
    infrastructureSafe: infrastructure.ok,
    reasons
  };
}
