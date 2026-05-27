export type SceneSignals = {
  hasIntroText?: boolean;
  hasCreditsText?: boolean;
  hasBlackFrames?: boolean;
  hasHumanPresence?: boolean;
  hasNarrativeAction?: boolean;
  hasStrongMotion?: boolean;
  audioEnergyDb?: number;
  durationSeconds?: number;
};

export type SceneDecision = {
  ok: boolean;
  score: number;
  reasons: string[];
};
