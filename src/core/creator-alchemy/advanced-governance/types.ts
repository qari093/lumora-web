export type GovernanceSeverity = "safe" | "watch" | "intervene" | "block";

export interface AdvancedGovernanceSignal {
  diagnosticLanguage: boolean;
  guiltPressureScore: number;
  addictionLoopScore: number;
  casinoEconomyScore: number;
  burnoutRiskScore: number;
  memorialConsentVerified: boolean;
  creatorConsentVerified: boolean;
  sponsorCompatible: boolean;
  manipulationScore: number;
}

export interface AdvancedGovernanceDecision {
  severity: GovernanceSeverity;
  allowed: boolean;
  interventions: string[];
}
