export type IdentityOverrideReasonExplainerInput = {
  mode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
  reason:
    | "ok"
    | "age_gate_required"
    | "sensitivity_blocked"
    | "rights_blocked"
    | "cultural_suppression_active";
  affectedSurfaces?: string[];
};

export type IdentityOverrideReasonExplanation = {
  headline: string;
  reasons: string[];
};

export function buildIdentityOverrideReasonExplanation(
  input: IdentityOverrideReasonExplainerInput
): IdentityOverrideReasonExplanation {
  const reasons: string[] = [];

  switch (input.reason) {
    case "age_gate_required":
      reasons.push("Some experiences require age confirmation before they can appear.");
      break;
    case "sensitivity_blocked":
      reasons.push("Sensitive content protections are filtering part of your feed.");
      break;
    case "rights_blocked":
      reasons.push("Rights limitations prevent some interactive experiences from being shown.");
      break;
    case "cultural_suppression_active":
      reasons.push("Cultural protection rules are limiting this discovery path.");
      break;
    case "ok":
    default:
      reasons.push("Your identity layer is active with no active safety override.");
      break;
  }

  if (input.affectedSurfaces && input.affectedSurfaces.length > 0) {
    reasons.push(
      `Affected surfaces: ${input.affectedSurfaces
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4)
        .join(", ")}`
    );
  }

  reasons.push(`Current mode: ${input.mode}`);

  return {
    headline: "Why identity-based discovery changed",
    reasons: reasons.slice(0, 4),
  };
}

export function hasIdentityOverrideReasonExplanation(
  explanation: IdentityOverrideReasonExplanation
): boolean {
  return explanation.reasons.length > 0;
}
