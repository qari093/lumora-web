export type UserControlExplainerInput = {
  changedKeys: string[];
  blockedKeys?: string[];
  discoveryIntensity?: "low" | "balanced" | "high";
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
};

export type UserControlExplanation = {
  headline: string;
  reasons: string[];
};

export function buildUserControlExplanation(
  input: UserControlExplainerInput
): UserControlExplanation {
  const reasons: string[] = [];

  if (input.changedKeys.length > 0) {
    reasons.push(
      `Updated controls: ${input.changedKeys.map((key) => key.trim()).filter(Boolean).slice(0, 6).join(", ")}`
    );
  }

  if (input.blockedKeys && input.blockedKeys.length > 0) {
    reasons.push(
      `Blocked controls: ${input.blockedKeys.map((key) => key.trim()).filter(Boolean).slice(0, 6).join(", ")}`
    );
  }

  if (input.discoveryIntensity) {
    reasons.push(`Discovery intensity set to ${input.discoveryIntensity}`);
  }

  reasons.push(`Safety mode: ${input.safetyMode}`);

  return {
    headline: "Your discovery controls were updated",
    reasons: reasons.slice(0, 4),
  };
}

export function hasUserControlExplanation(
  explanation: UserControlExplanation
): boolean {
  return explanation.reasons.length > 0;
}
