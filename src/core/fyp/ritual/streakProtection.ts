export type StreakProtection = {
  protected: boolean;
  graceHours: number;
  reason: string;
};

export function calculateStreakProtection(input: {
  streak: number;
  missedHours: number;
}): StreakProtection {
  if (
    input.streak >= 7 &&
    input.missedHours <= 12
  ) {
    return {
      protected: true,
      graceHours: 12,
      reason: "long_term_loyalty"
    };
  }

  return {
    protected: false,
    graceHours: 0,
    reason: "none"
  };
}
