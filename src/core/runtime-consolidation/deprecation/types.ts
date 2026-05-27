export type DeprecationSeverity = "soft" | "strict" | "blocked";

export interface RuntimeDeprecationEntry {
  deprecatedPrefix: string;
  canonicalPrefix: string;
  severity: DeprecationSeverity;
  reason: string;
  migrationNote: string;
  removalPhase: string;
}

export interface RuntimeDeprecationDecision {
  deprecated: boolean;
  allowed: boolean;
  severity: DeprecationSeverity | "none";
  canonicalRoute: string | null;
  migrationNote: string | null;
}
