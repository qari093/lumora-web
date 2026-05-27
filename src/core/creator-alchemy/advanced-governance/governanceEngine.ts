import type { AdvancedGovernanceDecision, AdvancedGovernanceSignal } from "./types";

export function evaluateAdvancedGovernance(signal: AdvancedGovernanceSignal): AdvancedGovernanceDecision {
  const interventions: string[] = [];

  if (signal.diagnosticLanguage) interventions.push("suppress_diagnostic_language");
  if (signal.guiltPressureScore > 0.25) interventions.push("reduce_guilt_pressure");
  if (signal.addictionLoopScore > 0.4) interventions.push("reduce_addiction_loop");
  if (signal.casinoEconomyScore > 0) interventions.push("block_casino_economy");
  if (signal.burnoutRiskScore > 0.75) interventions.push("activate_recovery_mode");
  if (!signal.creatorConsentVerified) interventions.push("require_creator_consent");
  if (!signal.sponsorCompatible) interventions.push("reject_sponsor");
  if (signal.manipulationScore > 0.3) interventions.push("block_manipulation");

  const hardBlock =
    signal.diagnosticLanguage ||
    signal.casinoEconomyScore > 0 ||
    !signal.creatorConsentVerified ||
    signal.manipulationScore > 0.6;

  const severity =
    hardBlock ? "block" :
    interventions.length >= 3 ? "intervene" :
    interventions.length > 0 ? "watch" :
    "safe";

  return {
    severity,
    allowed: severity !== "block",
    interventions
  };
}
