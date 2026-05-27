import type { GovernanceSignal } from "./types";

export function evaluateGovernanceSafety(signal: GovernanceSignal): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (signal.diagnosticLanguage > 0) reasons.push("diagnostic_language_detected");
  if (signal.guiltPressure > 0.2) reasons.push("guilt_pressure_high");
  if (signal.casinoRisk > 0) reasons.push("casino_risk_detected");
  if (signal.creatorBurnoutRisk > 0.75) reasons.push("creator_burnout_high");
  if (signal.consentRisk > 0) reasons.push("consent_risk_detected");
  if (signal.manipulationRisk > 0.25) reasons.push("manipulation_risk_high");

  return {
    ok: reasons.length === 0,
    reasons
  };
}
