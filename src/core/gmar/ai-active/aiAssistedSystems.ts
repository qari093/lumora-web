export function createGmarAiMissionSuggestion(input: any = {}) {
  const state = input.state ?? {};
  return {
    id: "gmar_ai_mission_suggestion_001",
    mode: "assistive",
    playerId: state.player?.playerId ?? "gmar_user_001",
    humanReviewRequired: true,
    suggestion: "Stabilize the first signal without pressure."
  };
}

export function assertGmarAiMissionSuggestion(suggestion: any): boolean {
  return Boolean(suggestion?.mode === "assistive" && suggestion?.playerId === "gmar_user_001" && suggestion?.humanReviewRequired === true);
}

