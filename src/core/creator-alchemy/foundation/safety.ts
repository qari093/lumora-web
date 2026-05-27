import type { EmotionalRisk } from "./types";

const BLOCKED_PHRASES = [
  "diagnosis",
  "trauma decoded",
  "you are depressed",
  "you are anxious",
  "your followers need you",
  "you will lose everything",
  "guaranteed payout",
  "creator stock",
  "bet on creator",
  "pay to win"
];

export interface SafetyCheck {
  ok: boolean;
  risks: EmotionalRisk[];
  blockedPhrases: string[];
}

export function validateCreatorAlchemyCopy(copy: string): SafetyCheck {
  const normalized = copy.toLowerCase();
  const blockedPhrases = BLOCKED_PHRASES.filter((phrase) => normalized.includes(phrase));

  const risks = new Set<EmotionalRisk>();

  if (blockedPhrases.some((phrase) => phrase.includes("diagnosis") || phrase.includes("depressed") || phrase.includes("anxious") || phrase.includes("trauma"))) {
    risks.add("surveillance_feel");
  }

  if (blockedPhrases.some((phrase) => phrase.includes("guaranteed") || phrase.includes("stock") || phrase.includes("bet") || phrase.includes("pay to win"))) {
    risks.add("casino_mechanics");
  }

  if (normalized.includes("must post") || normalized.includes("do not disappear")) {
    risks.add("burnout_pressure");
  }

  if (normalized.includes("your constellation defines you")) {
    risks.add("identity_lock");
  }

  return {
    ok: blockedPhrases.length === 0 && risks.size === 0,
    risks: [...risks],
    blockedPhrases
  };
}
