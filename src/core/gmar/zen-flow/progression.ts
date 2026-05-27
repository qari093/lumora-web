export type ZenFlowProgress = {
  sessionCount: number;
  calmContinuity: number;
  unlocksDailySpark: boolean;
  unlocksFirstLightRevisit: boolean;
};

export function createZenFlowProgress(sessionCount: number): ZenFlowProgress {
  return {
    sessionCount,
    calmContinuity: Math.min(1, sessionCount / 7),
    unlocksDailySpark: sessionCount >= 1,
    unlocksFirstLightRevisit: sessionCount >= 3,
  };
}
