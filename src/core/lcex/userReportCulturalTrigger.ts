export type UserReportCulturalReason =
  | "cultural_insensitivity"
  | "religious_sensitivity"
  | "political_sensitivity"
  | "national_identity"
  | "symbolism_risk"
  | "language_offense"
  | "satire_confusion"
  | "other";

export type UserReportCulturalTriggerInput = {
  entityId: string;
  reportId: string;
  reporterId?: string;
  reason: UserReportCulturalReason;
  severity: 1 | 2 | 3 | 4 | 5;
  region?: string;
  language?: string;
  note?: string;
  createdAt: string;
};

export type UserReportCulturalTriggerResult = {
  triggered: boolean;
  escalationLevel: "none" | "review" | "priority-review" | "fast-escalation";
  score: number;
  normalizedReason: UserReportCulturalReason;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function reasonWeight(reason: UserReportCulturalReason): number {
  switch (reason) {
    case "religious_sensitivity":
    case "political_sensitivity":
    case "national_identity":
      return 22;
    case "symbolism_risk":
    case "language_offense":
    case "satire_confusion":
      return 16;
    case "cultural_insensitivity":
      return 18;
    default:
      return 10;
  }
}

export function evaluateUserReportCulturalTrigger(
  input: UserReportCulturalTriggerInput
): UserReportCulturalTriggerResult {
  const score = clampScore(reasonWeight(input.reason) + input.severity * 14);

  if (score >= 80) {
    return {
      triggered: true,
      escalationLevel: "fast-escalation",
      score,
      normalizedReason: input.reason,
    };
  }

  if (score >= 60) {
    return {
      triggered: true,
      escalationLevel: "priority-review",
      score,
      normalizedReason: input.reason,
    };
  }

  if (score >= 35) {
    return {
      triggered: true,
      escalationLevel: "review",
      score,
      normalizedReason: input.reason,
    };
  }

  return {
    triggered: false,
    escalationLevel: "none",
    score,
    normalizedReason: input.reason,
  };
}

export function shouldOpenCulturalReviewFromUserReport(
  input: UserReportCulturalTriggerInput
): boolean {
  return evaluateUserReportCulturalTrigger(input).triggered;
}
