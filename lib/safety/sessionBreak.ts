export type SessionBreakInput = {
  surgeSessions?: number;
  fatigueScore?: number;
  cooldownMinutes?: number;
};

export type SessionBreakResult = {
  shouldBreak: boolean;
  breakMinutes: number;
  reason: "session_count" | "fatigue" | "none";
};

export function getSessionBreak(input: SessionBreakInput): SessionBreakResult {
  const surgeSessions = Math.max(0, input.surgeSessions ?? 0);
  const fatigueScore = Math.max(0, Math.min(1, input.fatigueScore ?? 0));
  const cooldownMinutes = Math.max(1, input.cooldownMinutes ?? 5);

  if (fatigueScore >= 0.8) {
    return {
      shouldBreak: true,
      breakMinutes: cooldownMinutes,
      reason: "fatigue",
    };
  }

  if (surgeSessions >= 3) {
    return {
      shouldBreak: true,
      breakMinutes: cooldownMinutes,
      reason: "session_count",
    };
  }

  return {
    shouldBreak: false,
    breakMinutes: 0,
    reason: "none",
  };
}
