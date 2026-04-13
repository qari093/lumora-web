import type { CulturalConfidence } from "./culturalConfidence";

export type CulturalEscalationAction =
  | "allow"
  | "deprioritize"
  | "metadata_only"
  | "region_restrict"
  | "manual_review"
  | "suppress";

export type CulturalEscalationInput = {
  culturalConfidence: CulturalConfidence;
  sensitivityScore: number;
  satireAmbiguityScore: number;
  regionRiskScore: number;
};

export type CulturalEscalationDecision = {
  action: CulturalEscalationAction;
  reason: string;
};

export function decideCulturalEscalation(
  input: CulturalEscalationInput
): CulturalEscalationDecision {
  if (input.culturalConfidence === "restricted") {
    return {
      action: "manual_review",
      reason: "Restricted cultural confidence requires manual review.",
    };
  }

  if (input.sensitivityScore >= 85 || input.satireAmbiguityScore >= 85) {
    return {
      action: "manual_review",
      reason: "High sensitivity or satire ambiguity requires escalation.",
    };
  }

  if (input.regionRiskScore >= 85) {
    return {
      action: "region_restrict",
      reason: "High regional risk requires restricted surfacing.",
    };
  }

  if (input.culturalConfidence === "low") {
    return {
      action: "metadata_only",
      reason: "Low cultural confidence should downgrade to metadata-only.",
    };
  }

  if (input.sensitivityScore >= 65 || input.regionRiskScore >= 65) {
    return {
      action: "deprioritize",
      reason: "Moderate cultural risk should reduce promotion priority.",
    };
  }

  return {
    action: "allow",
    reason: "Cultural confidence and risk profile are acceptable.",
  };
}
