export type UserControlVisibilityRulesInput = {
  ageGateRequired: boolean;
  liveRoomAvailable: boolean;
  versusAvailable: boolean;
  predictionPickAvailable: boolean;
  moodBoardsAvailable: boolean;
  fandomBadgesAvailable: boolean;
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
};

export type UserControlVisibilityRulesResult = {
  showDiscoveryIntensity: boolean;
  showNoveltyOptIn: boolean;
  showLiveRoomOptIn: boolean;
  showVersusOptIn: boolean;
  showPredictionPickOptIn: boolean;
  showMoodBoardsOptIn: boolean;
  showFandomBadgesOptIn: boolean;
};

export function resolveUserControlVisibility(
  input: UserControlVisibilityRulesInput
): UserControlVisibilityRulesResult {
  const suppressed = input.safetyMode === "suppressed";
  const interactiveDisabled = input.safetyMode === "interactive-disabled";
  const safeFiltered = input.safetyMode === "safe-filtered";

  return {
    showDiscoveryIntensity: !suppressed,
    showNoveltyOptIn: !suppressed,
    showLiveRoomOptIn:
      !suppressed &&
      !interactiveDisabled &&
      !input.ageGateRequired &&
      input.liveRoomAvailable,
    showVersusOptIn:
      !suppressed &&
      !interactiveDisabled &&
      !input.ageGateRequired &&
      input.versusAvailable,
    showPredictionPickOptIn:
      !suppressed &&
      !interactiveDisabled &&
      input.predictionPickAvailable,
    showMoodBoardsOptIn:
      !suppressed &&
      input.moodBoardsAvailable,
    showFandomBadgesOptIn:
      !suppressed &&
      !safeFiltered &&
      input.fandomBadgesAvailable,
  };
}

export function hasVisibleUserControls(
  result: UserControlVisibilityRulesResult
): boolean {
  return Object.values(result).some(Boolean);
}
