export type UserControlSummaryInput = {
  userId: string;
  discoveryIntensity: "low" | "balanced" | "high";
  enabledControls: string[];
  blockedControls?: string[];
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
};

export type UserControlSummary = {
  userId: string;
  headline: string;
  summaryLine: string;
  healthy: boolean;
};

export function buildUserControlSummary(
  input: UserControlSummaryInput
): UserControlSummary {
  const enabled = input.enabledControls.map((key) => key.trim()).filter(Boolean);
  const blocked = (input.blockedControls ?? []).map((key) => key.trim()).filter(Boolean);

  return {
    userId: input.userId.trim(),
    headline: `Controls tuned for ${input.discoveryIntensity} discovery`,
    summaryLine: `${enabled.length} enabled • ${blocked.length} blocked • mode ${input.safetyMode}`,
    healthy:
      input.userId.trim().length > 0 &&
      input.safetyMode !== "suppressed" &&
      enabled.length > 0,
  };
}

export function hasHealthyUserControlSummary(
  summary: UserControlSummary
): boolean {
  return summary.healthy;
}
